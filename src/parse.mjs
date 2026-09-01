// Port of AnswerDotAI/llms-txt `parse_llms_file` (llms_txt/core.py), extended to keep the
// off-spec lines so the checks can point at them. Spec: https://llmstxt.org/
const LINK_RE = /^-\s*\[(?<title>[^\]]+)\]\((?<url>[^)\s]+)\)(?:\s*:\s*(?<desc>.*))?\s*$/;

export function parseLlmsTxt(text) {
  const bom = text.charCodeAt(0) === 0xfeff;
  if (bom) text = text.slice(1);
  const crlf = /\r\n/.test(text);
  const norm = text.replace(/\r\n?/g, '\n');
  const parts = norm.split(/^##(?!#)\s*(.*?)\s*$/m);
  const head = parts[0];
  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i];
    const body = parts[i + 1] ?? '';
    const links = [], stray = [];
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(LINK_RE);
      if (m) links.push({ title: m.groups.title.trim(), url: m.groups.url.trim(), desc: (m.groups.desc ?? '').trim() });
      else stray.push(line);
    }
    sections.push({ name, links, stray });
  }
  const h1s = [...head.matchAll(/^#(?!#)\s*(.+?)\s*$/gm)].map((m) => m[1]);
  const title = h1s[0] ?? null;
  const afterTitle = title ? head.slice(head.indexOf(h1s[0]) + h1s[0].length) : head;
  const summaryMatch = afterTitle.match(/^\s*\n*>\s*(.+?)\s*$/m);
  const summary = summaryMatch ? summaryMatch[1] : null;
  const info = afterTitle
    .replace(summaryMatch ? summaryMatch[0] : '', '')
    .trim();
  const deepHeadings = [...norm.matchAll(/^#{3,}\s*(.+?)\s*$/gm)].map((m) => m[0].trim());
  return { bom, crlf, title, h1Count: h1s.length, summary, info, sections, deepHeadings };
}

export function allLinks(parsed) {
  return parsed.sections.flatMap((s) => s.links.map((l) => ({ ...l, section: s.name })));
}
