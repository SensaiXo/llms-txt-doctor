// Enforces the "never invent a URL" rule in code instead of only a prompt instruction.
// A proposed llms.txt may only link URLs that appear verbatim in the frozen case text
// (case.md: site digest, llms.txt verbatim, every resolved link, sitemap pages). Anything
// else is a hallucinated page and must be flagged, not silently trusted.
const URL_RE = /https?:\/\/[^\s)\]"']+/g;

function stripTrailingPunct(u) {
  return u.replace(/[.,;:]+$/, '');
}

export function extractUrls(text) {
  return [...(text.match(URL_RE) ?? [])].map(stripTrailingPunct);
}

export function checkProvenance(proposedText, caseText) {
  const urls = extractUrls(proposedText);
  const violations = urls.filter((u) => !caseText.includes(u));
  return { ok: violations.length === 0, urls, violations };
}
