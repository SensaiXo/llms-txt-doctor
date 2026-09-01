// Small bounded fetch helper. Raw bytes are kept so encoding can be judged before decoding.
export const USER_AGENT = 'llms-txt-doctor/0.1 (+https://github.com/SensaiXo/llms-txt-doctor)';
const MAX_BYTES = 2_000_000;

export async function fetchRaw(url, { timeoutMs = 10_000, method = 'GET' } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'text/markdown, text/plain, text/html;q=0.9, */*;q=0.5' },
    });
    const buf = method === 'HEAD' ? Buffer.alloc(0) : Buffer.from(await res.arrayBuffer());
    return {
      url,
      finalUrl: res.url || url,
      status: res.status,
      ok: res.ok,
      contentType: res.headers.get('content-type') ?? '',
      link: res.headers.get('link') ?? '',
      bytes: buf.subarray(0, MAX_BYTES),
      tooLarge: buf.length > MAX_BYTES,
      error: null,
    };
  } catch (e) {
    return { url, finalUrl: url, status: 0, ok: false, contentType: '', link: '', bytes: Buffer.alloc(0), tooLarge: false, error: e.name === 'AbortError' ? 'timeout' : String(e.message ?? e) };
  } finally {
    clearTimeout(t);
  }
}

// Decode as UTF-8 and report what went wrong, if anything.
export function decodeUtf8(bytes) {
  const strict = new TextDecoder('utf-8', { fatal: true });
  try {
    const text = strict.decode(bytes);
    const mojibake = (text.match(/Ã[\x80-\xBF]|â€|Â[\xA0-\xBF]/g) ?? []).length;
    const replacement = (text.match(/�/g) ?? []).length;
    return { text, valid: true, mojibake, replacement };
  } catch {
    const text = new TextDecoder('utf-8').decode(bytes);
    return { text, valid: false, mojibake: 0, replacement: (text.match(/�/g) ?? []).length };
  }
}

export function isHtml(ct) { return /text\/html|application\/xhtml/i.test(ct); }
export function isMarkdown(ct, url = '') { return /text\/markdown/i.test(ct) || /\.md(\?|#|$)/i.test(url); }

// Very small HTML digest: title, meta description, h1, lang, rel links. No DOM lib needed.
export function digestHtml(html) {
  const pick = (re) => (html.match(re)?.[1] ?? '').replace(/\s+/g, ' ').trim();
  const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return {
    title: decode(pick(/<title[^>]*>([\s\S]*?)<\/title>/i)),
    description: decode(pick(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || pick(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)),
    h1: decode(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '')),
    lang: pick(/<html[^>]*\blang=["']([^"']+)["']/i),
    mdAlternate: links.find((l) => /alternate/i.test(l.rel ?? '') && /text\/markdown/i.test(l.type ?? ''))?.href ?? null,
    describedBy: links.find((l) => /describedby/i.test(l.rel ?? ''))?.href ?? null,
    canonical: links.find((l) => /^canonical$/i.test(l.rel ?? ''))?.href ?? null,
  };
}

export function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}
