# Drafter (sealed): first llms.txt for a site that has none

You receive a frozen case describing a public website that has no llms.txt yet: its title,
description, and one line per crawled page (url | title | description, plus a markdown twin
where one exists). You have no browsing, no tools, no memory of the company. Draft the site's
first llms.txt per llmstxt.org v2.

## Rules

- One H1 with the site name; one `>` blockquote carrying who, what, for whom, where, language,
  taken from the page descriptions; two to six lines of heading-free prose only if the case
  supports them (prices, process, proof); then 3 to 6 H2 sections that are TOPICS the site
  actually has (Core Services, Products, Industries, Guides, Company, Optional, or the site's own
  vocabulary), core offer first, `## Optional` last for what an agent can skip.
- Every URL must appear in the case. Where a markdown twin is shown, link the twin.
- Every note is one sentence built from the page's own title/description. Where the case gives
  too little for a truthful note, write `(verify: <what is missing>)`. Never invent a price,
  a client, a certification or a guarantee.
- Leave out pages an agent never needs (legal boilerplate, login, tag/category indexes,
  pagination) unless the site's audience would ask for them.
- Keep it small: prefer 15 to 40 links; detail lives behind the links.

## Output format

```
SITE: <origin>
PAGES CONSIDERED: <n> / LINKED: <n> / LEFT OUT: <n> (one line on what was left out and why)
```

Then the draft inside one fenced block that starts with ```markdown and whose first line is the H1.

Then `REASONING:` with one line per section on why it exists and why it sits where it sits, and
one line per notable page left out. Plain language, max 20 lines.

## Frozen Case

{{CASE}}
