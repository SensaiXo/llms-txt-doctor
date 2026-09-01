// Objective checks. Every finding: { id, severity: BLOCKING|ADVISORY|INFO, message, evidence[] }.
// No judgement calls here: anything that needs taste (is this page important? are these two
// claims contradictory?) is left to the lens layer and only PREPARED here as evidence.
const GENERIC_SECTION = /^(pages|links|resources|content|docs|documentation|sitemap|urls|files)$/i;
const MONEY_RE = /(?:CHF|EUR|USD|\$|€)\s?\d[\d'’.,]*|\d[\d'’.,]*\s?(?:CHF|EUR|USD|€)/g;

function norm(u) { return u.replace(/\/$/, '').replace(/#.*$/, '').toLowerCase(); }

export function runChecks(c) {
  const f = [];
  const add = (id, severity, message, evidence = []) => f.push({ id, severity, message, evidence });

  if (!c.llms.parsed) {
    add('LLMS_MISSING', 'BLOCKING', `/llms.txt not served (HTTP ${c.llms.status})`, [c.llms.url]);
    return f;
  }
  const p = c.llms.parsed;

  // A catch-all rewrite that returns the homepage for every unknown path is the most common way an
  // llms.txt "exists" without existing. Name it, do not report it as "no H1".
  if (/text\/html/i.test(c.llms.contentType) || /^\s*(﻿)?<!doctype\s+html|^\s*<html/i.test(c.llms.raw)) {
    add('LLMS_IS_HTML', 'BLOCKING', `/llms.txt returns an HTML page (${c.llms.contentType || 'no content-type'}), probably a catch-all rewrite serving the homepage; agents get a web page, not the file`, [c.llms.url]);
    return f;
  }

  // encoding + transport
  if (!c.llms.encoding.valid) add('ENCODING_INVALID_UTF8', 'BLOCKING', 'llms.txt is not valid UTF-8');
  if (c.llms.encoding.mojibake) add('ENCODING_MOJIBAKE', 'BLOCKING', `${c.llms.encoding.mojibake} mojibake sequence(s) (text double-encoded, e.g. "Ã¼" for "ü")`);
  if (c.llms.encoding.replacement) add('ENCODING_REPLACEMENT_CHARS', 'BLOCKING', `${c.llms.encoding.replacement} U+FFFD replacement character(s)`);
  if (!/^text\//i.test(c.llms.contentType)) add('CONTENT_TYPE', 'ADVISORY', `served as "${c.llms.contentType || 'unknown'}", expected text/plain or text/markdown`);
  if (p.crlf) add('CRLF_LINE_ENDINGS', 'ADVISORY', 'CRLF line endings; spec parsers expect LF');
  if (p.bom) add('BOM_PRESENT', 'INFO', 'byte-order mark present (allowed by spec, harmless)');
  if (c.llms.bytes > 32_768) add('SIZE_LARGE', 'ADVISORY', `${c.llms.bytes} bytes; the file should stay small enough to sit in context, detail belongs behind the links`);

  // structure vs spec
  if (!p.title) add('NO_H1', 'BLOCKING', 'no H1 title (the only required element)');
  if (p.h1Count > 1) add('MULTIPLE_H1', 'BLOCKING', `${p.h1Count} H1 headings; spec allows one`);
  if (!p.summary) add('NO_SUMMARY', 'ADVISORY', 'no "> summary" blockquote after the H1');
  if (p.deepHeadings.length) add('DEEP_HEADINGS', 'ADVISORY', 'H3+ headings present; spec allows H1 then H2 file lists only', p.deepHeadings);
  if (!p.sections.length) add('NO_SECTIONS', 'BLOCKING', 'no "## section" link lists');
  const nonOptional = p.sections.filter((s) => !/^optional$/i.test(s.name));
  const links = c.links;
  if (nonOptional.length === 1 && links.length >= 8) add('FLAT_HIERARCHY', 'ADVISORY', `all ${links.length} links sit in one section "${nonOptional[0].name}"; agents cannot tell primary from secondary`);
  for (const s of p.sections) {
    if (GENERIC_SECTION.test(s.name) && s.links.length >= 5) add('GENERIC_SECTION_NAME', 'ADVISORY', `section "${s.name}" names a container, not a topic`, [s.name]);
    if (s.stray.length) add('NON_LINK_LINES_IN_SECTION', 'ADVISORY', `section "${s.name}" has ${s.stray.length} line(s) that are not "- [title](url): notes"`, s.stray.slice(0, 5));
    if (!s.links.length && !s.stray.length) add('EMPTY_SECTION', 'ADVISORY', `section "${s.name}" is empty`);
  }
  if (!p.sections.some((s) => /^optional$/i.test(s.name)) && links.length >= 10) add('NO_OPTIONAL_SECTION', 'INFO', 'no "## Optional" section; agents on a tight budget cannot skip anything');

  // links
  const seenUrl = new Map(), seenTitle = new Map();
  links.forEach((l, i) => {
    const k = norm(l.url);
    if (seenUrl.has(k)) add('DUPLICATE_URL', 'ADVISORY', `same URL listed twice`, [l.url, `sections: ${seenUrl.get(k)} + ${l.section}`]); else seenUrl.set(k, l.section);
    const t = l.title.toLowerCase();
    if (seenTitle.has(t)) add('DUPLICATE_TITLE', 'INFO', `same link title used twice: "${l.title}"`, [seenTitle.get(t), l.url]); else seenTitle.set(t, l.url);
    if (!l.desc) add('DESC_MISSING', 'ADVISORY', `no description: [${l.title}]`, [l.url]);
    else if (l.desc.toLowerCase() === l.title.toLowerCase()) add('DESC_EQUALS_TITLE', 'ADVISORY', `description repeats the title: [${l.title}]`, [l.url]);
    else if (l.desc.length < 15) add('DESC_TOO_SHORT', 'INFO', `description "${l.desc}" says little about when to fetch [${l.title}]`, [l.url]);
    const r = c.resources[i];
    if (!r) return;
    if (r.status === 0 || r.status >= 400) add('DEAD_LINK', 'BLOCKING', `[${l.title}] returns HTTP ${r.status}${r.error ? ' ' + r.error : ''}`, [l.url]);
    else if (r.kind === 'html') {
      if (r.mdTwin) add('HTML_LINKED_MD_EXISTS', 'ADVISORY', `[${l.title}] links the HTML page but a markdown twin exists; link the .md`, [l.url, r.mdTwin]);
      else add('HTML_WITHOUT_MD_TWIN', 'ADVISORY', `[${l.title}] is HTML with no markdown alternative (.md, .html.md, index.md, rel=alternate)`, [l.url]);
    }
    // claims in the note that the linked resource does not contain (prices, amounts)
    const claims = (l.desc.match(MONEY_RE) ?? []).map((m) => m.replace(/[’']/g, "'").replace(/\s+/g, ''));
    if (claims.length && r.text) {
      const body = r.text.replace(/[’']/g, "'").replace(/\s+/g, '');
      const missing = claims.filter((m) => !body.includes(m));
      if (missing.length) add('CLAIM_NOT_ON_PAGE', 'BLOCKING', `note for [${l.title}] states ${missing.join(', ')} but the linked page does not contain it`, [l.url]);
    }
  });

  // discoverability from the human site
  const home = c.home.digest;
  const hasDescribedBy = Boolean(home?.describedBy) || /rel="?describedby"?/i.test(c.home.linkHeader);
  if (!hasDescribedBy) add('NO_DESCRIBEDBY_LINK', 'INFO', 'homepage has no <link rel="describedby"> or Link header pointing at /llms.txt');
  const nonMd = links.filter((l) => !/\.md$/i.test(l.url)).length;
  const md = links.length - nonMd;
  add('MARKDOWN_COVERAGE', 'INFO', `${md} of ${links.length} links point at markdown`);

  // context budget per section, the llms_txt2ctx idea: an agent that loads a whole section gets this many bytes
  const perSection = new Map();
  links.forEach((l, i) => { const b = c.resources[i]?.bytes ?? 0; perSection.set(l.section, (perSection.get(l.section) ?? 0) + b); });
  for (const [name, bytes] of perSection) {
    if (bytes > 400_000) add('SECTION_TOO_HEAVY', 'ADVISORY', `section "${name}" links ${Math.round(bytes / 1024)} KB of content; an agent loading it whole blows a normal context budget, split it or move bulk to Optional`, [name]);
  }
  add('CONTEXT_BUDGET', 'INFO', [...perSection].map(([n, b]) => `${n}: ${Math.round(b / 1024)} KB`).join(', ') || 'no sections');

  // sitemap coverage (importance is a lens decision; here only the count)
  if (c.sitemap.unlisted) add('SITEMAP_PAGES_NOT_LISTED', 'INFO', `${c.sitemap.unlisted} of ${c.sitemap.total} sitemap URLs are not in llms.txt (that can be correct: llms.txt is curated, not a sitemap)`);

  return f;
}

// One systemic defect repeated 20 times is one problem, not twenty: penalty per id is capped
// at three occurrences so the score still separates "one dead link" from "twenty".
export function score(findings) {
  const w = { BLOCKING: 15, ADVISORY: 4, INFO: 0 };
  const seen = new Map();
  let penalty = 0;
  for (const x of findings) {
    const n = (seen.get(x.id) ?? 0) + 1;
    seen.set(x.id, n);
    if (n <= 3) penalty += w[x.severity] ?? 0;
  }
  return Math.max(0, 100 - penalty);
}
