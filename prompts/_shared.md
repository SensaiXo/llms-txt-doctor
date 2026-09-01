# Shared rules for every lens (copied into each prompt; this file is documentation only)

- You receive exactly one frozen case and nothing else. No browsing, no tools, no memory of
  the company. Judge only the text you are given.
- The deterministic findings in the case are already established. Do not re-derive them; cite
  them by id when they support a point, and go beyond them.
- Never invent pages. Every URL you mention must appear in the case (in the llms.txt, the
  linked-resource table, or the unlisted-sitemap list).
- Spec you are judging against (llmstxt.org v2): one H1 (site name); a `>` blockquote summary
  with the key facts needed to understand the rest; optional prose without headings; H2
  sections that are markdown lists of `- [title](url): note`; `## Optional` for links an agent
  may skip on a tight budget; links should point at markdown twins, not HTML; file stays small,
  detail lives behind the links; an agent given only this file should be able to answer the
  questions the site's audience actually asks.
- Finding format: summary (one line); what in the case shows it (quote or id); why it costs an
  agent something; severity BLOCKING or ADVISORY; confidence high/medium/low.
- End with exactly one line: `VERDICT: PASS` or `VERDICT: BLOCKING`.
