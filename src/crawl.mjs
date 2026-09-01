// Deterministic evidence gathering. Uses Engawa's runInspect for the site crawl (sitemap,
// routes, framework, locales) and adds what the llms.txt audit needs on top: raw llms.txt
// bytes, one fetch per llms.txt link (status, content-type, markdown twin, page digest),
// and a digest of sitemap pages the file does not mention.
import { runInspect } from '@thierry-gilgen-ict/engawa-cli';
import { fetchRaw, decodeUtf8, isHtml, isMarkdown, digestHtml, htmlToText } from './fetch.mjs';
import { parseLlmsTxt, allLinks } from './parse.mjs';

const CONCURRENCY = 6;

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// Candidate markdown twins per llmstxt.org v2: page.md, page.html.md, dir/index.md, dir/index.html.md
export function markdownTwinCandidates(url) {
  const u = new URL(url);
  const p = u.pathname;
  const mk = (path) => new URL(path + u.search, u.origin).href;
  if (/\.md$/i.test(p)) return [];
  if (p.endsWith('/')) return [mk(p + 'index.md'), mk(p + 'index.html.md'), mk(p.replace(/\/$/, '') + '.md')];
  if (/\.html?$/i.test(p)) return [mk(p + '.md'), mk(p.replace(/\.html?$/i, '.md'))];
  return [mk(p + '.md'), mk(p + '/index.md'), mk(p + '.html.md')];
}

async function digestResource(url, timeoutMs) {
  const r = await fetchRaw(url, { timeoutMs });
  const out = { url, finalUrl: r.finalUrl, status: r.status, contentType: r.contentType, error: r.error, kind: 'other', html: null, text: '', bytes: r.bytes.length, mdTwin: null, mdTwinChecked: [] };
  if (!r.ok) return out;
  const { text } = decodeUtf8(r.bytes);
  if (isMarkdown(r.contentType, r.finalUrl) || (!isHtml(r.contentType) && /^\s*#\s/.test(text))) {
    out.kind = 'markdown';
    out.text = text.slice(0, 20_000);
    // First heading + first paragraph stand in for title/description so the case table is comparable.
    const h = text.match(/^#\s+(.+?)\s*$/m)?.[1] ?? '';
    const para = text.replace(/^#.*$/gm, '').replace(/^>\s?/gm, '').split(/\n\s*\n/).map((s) => s.replace(/\s+/g, ' ').trim()).find((s) => s.length > 30) ?? '';
    out.html = { title: h, description: para.slice(0, 200) };
    return out;
  }
  if (isHtml(r.contentType)) {
    out.kind = 'html';
    out.html = digestHtml(text);
    out.text = htmlToText(text).slice(0, 20_000);
    const linkHeaderMd = r.link.match(/<([^>]+)>;[^,]*rel="?alternate"?[^,]*type="?text\/markdown"?/i)?.[1];
    const candidates = [out.html.mdAlternate, linkHeaderMd, ...markdownTwinCandidates(r.finalUrl)]
      .filter(Boolean).map((c) => new URL(c, r.finalUrl).href);
    for (const c of [...new Set(candidates)]) {
      const t = await fetchRaw(c, { timeoutMs });
      out.mdTwinChecked.push({ url: c, status: t.status });
      if (t.ok && !isHtml(t.contentType)) {
        const md = decodeUtf8(t.bytes).text;
        if (/^\s*#\s/.test(md) || isMarkdown(t.contentType, c)) { out.mdTwin = c; break; }
      }
    }
  }
  return out;
}

// light: benchmark mode; caps the link checks and skips the unlisted-page digest (no lenses will run).
export async function crawl(inputUrl, { maxPages = 60, timeoutMs = 10_000, log = () => {}, light = false, llmsUrl = null } = {}) {
  log('inspecting site with Engawa');
  const inspect = await runInspect({ inputUrl, maxPages, timeoutMs, allowLocal: false });
  const origin = inspect.target.origin;

  log('fetching /llms.txt');
  const llmsRes = await fetchRaw(llmsUrl ?? new URL('/llms.txt', origin).href, { timeoutMs });
  const decoded = llmsRes.ok ? decodeUtf8(llmsRes.bytes) : { text: '', valid: true, mojibake: 0, replacement: 0 };
  const parsed = llmsRes.ok ? parseLlmsTxt(decoded.text) : null;
  const links = parsed ? allLinks(parsed) : [];

  log(`checking ${links.length} linked resources`);
  const resources = await pool(light ? links.slice(0, 40) : links, (l) => digestResource(l.url, timeoutMs));

  // Sitemap pages the file does not mention: digest a bounded sample so the lenses can judge importance.
  const listed = new Set(links.map((l) => l.url.replace(/\/$/, '').replace(/\.md$/, '').replace(/\.html$/, '')));
  // Engawa routes carry pathnames; the sitemap source flag tells us they came from sitemap.xml.
  // No sitemap? Fall back to every same-origin route the crawl found, so a site without one still gets a case.
  const publicRoutes = inspect.routes.filter((r) => !r.sensitivePathHint);
  const fromSitemap = publicRoutes.filter((r) => r.sources?.includes('sitemap'));
  const sitemapUrls = [...new Set((fromSitemap.length ? fromSitemap : publicRoutes).map((r) => new URL(r.path, origin).href))];
  const unlisted = sitemapUrls.filter((u) => !listed.has(u.replace(/\/$/, '').replace(/\.md$/, '').replace(/\.html$/, '')));
  const unlistedSample = light ? [] : unlisted.slice(0, maxPages);
  log(`digesting ${unlistedSample.length} of ${unlisted.length} sitemap pages not in llms.txt`);
  const unlistedDigest = await pool(unlistedSample, async (u) => {
    const r = await fetchRaw(u, { timeoutMs });
    if (!r.ok || !isHtml(r.contentType)) return { url: u, status: r.status, title: '', description: '', h1: '' };
    const d = digestHtml(decodeUtf8(r.bytes).text);
    // cheap twin probe so the drafter / coverage lens can prefer markdown where it already exists
    let mdTwin = null;
    for (const cand of [d.mdAlternate, ...markdownTwinCandidates(r.finalUrl)].filter(Boolean).map((x) => new URL(x, r.finalUrl).href)) {
      const t = await fetchRaw(cand, { timeoutMs });
      if (t.ok && !isHtml(t.contentType) && /^\s*#\s/.test(decodeUtf8(t.bytes).text)) { mdTwin = cand; break; }
    }
    return { url: u, status: r.status, title: d.title, description: d.description, h1: d.h1, mdTwin };
  });

  const home = await fetchRaw(origin + '/', { timeoutMs });
  const homeDigest = home.ok && isHtml(home.contentType) ? digestHtml(decodeUtf8(home.bytes).text) : null;
  const homeLinkHeader = home.link;

  return {
    origin,
    inspect,
    llms: { url: llmsRes.url, status: llmsRes.status, contentType: llmsRes.contentType, bytes: llmsRes.bytes.length, raw: decoded.text, encoding: { valid: decoded.valid, mojibake: decoded.mojibake, replacement: decoded.replacement }, parsed },
    links,
    resources,
    sitemap: { total: sitemapUrls.length, unlisted: unlisted.length, unlistedDigest, unlistedRest: unlisted.slice(maxPages) },
    home: { digest: homeDigest, linkHeader: homeLinkHeader },
  };
}
