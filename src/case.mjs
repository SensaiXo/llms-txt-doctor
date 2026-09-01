// Builds the frozen case: the ONLY thing the blind reviewers see. Plain markdown, bounded.
import { createHash } from 'node:crypto';

const cap = (s, n) => (s && s.length > n ? s.slice(0, n) + '…' : s ?? '');

export function buildCase(c, findings) {
  const i = c.inspect;
  const L = [];
  L.push(`# Frozen case: llms.txt audit of ${c.origin}`);
  L.push('');
  L.push('## Site as observed (deterministic crawl)');
  L.push(`- origin: ${c.origin}`);
  L.push(`- html title: ${cap(i.site.title, 200)}`);
  L.push(`- meta description: ${cap(i.site.metaDescription, 400)}`);
  L.push(`- html lang: ${i.site.htmlLang ?? '?'}; locales seen: ${i.locales.join(', ') || 'none'}`);
  L.push(`- generator/framework hints: ${[i.site.generator, ...(i.frameworkHints ?? [])].filter(Boolean).join(', ') || 'none'}`);
  L.push(`- sitemap URLs: ${c.sitemap.total}; pages crawled: ${i.crawl.pagesFetched}; Engawa readiness score: ${i.score.total}/${i.score.maxTotal}`);
  L.push('');
  L.push('## Current /llms.txt (verbatim)');
  L.push(`HTTP ${c.llms.status}, ${c.llms.contentType || 'no content-type'}, ${c.llms.bytes} bytes`);
  L.push('');
  L.push('~~~text');
  L.push(c.llms.raw.replace(/~~~/g, '~ ~ ~').trimEnd() || '(empty or missing)');
  L.push('~~~');
  L.push('');
  L.push('## What each linked resource actually is');
  L.push('Format: section | title | url | HTTP | kind | markdown twin | page title | page description');
  c.links.forEach((l, k) => {
    const r = c.resources[k] ?? {};
    const h = r.html ?? {};
    L.push(`- ${l.section} | ${l.title} | ${l.url} | ${r.status} | ${r.kind} | ${r.mdTwin ?? (r.kind === 'html' ? 'NONE' : 'n/a')} | ${cap(h.title, 120)} | ${cap(h.description, 200)}`);
  });
  L.push('');
  L.push('## Sitemap pages NOT in llms.txt (title | description)');
  if (!c.sitemap.unlistedDigest.length) L.push('- none');
  for (const u of c.sitemap.unlistedDigest) L.push(`- ${u.url} | ${cap(u.title, 120)} | ${cap(u.description, 200)}`);
  if (c.sitemap.unlistedRest.length) L.push(`- …and ${c.sitemap.unlistedRest.length} more: ${c.sitemap.unlistedRest.slice(0, 40).join(' ')}`);
  L.push('');
  L.push('## Deterministic findings (already established, do not re-derive; build on them)');
  for (const f of findings) L.push(`- [${f.severity}] ${f.id}: ${f.message}${f.evidence?.length ? ' (' + f.evidence.slice(0, 3).join('; ') + ')' : ''}`);
  L.push('');
  const text = L.join('\n') + '\n';
  const fingerprint = createHash('sha256').update(text).digest('hex').slice(0, 12);
  return { text, fingerprint };
}
