// `npx is-agent-ready schnellstart.ai` must work: no scheme → https.
export function normalizeTarget(input) {
  const s = String(input ?? '').trim();
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  let u;
  try { u = new URL(withScheme); } catch { throw new Error(`not a URL: ${input}`); }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname) && u.hostname !== 'localhost') throw new Error(`not a URL: ${input}`);
  return u.href;
}
