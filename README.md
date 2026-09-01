# llms-txt-doctor

**Audit a website's `llms.txt` against the spec and against the site's real structure, then get a
corrected file with the reasoning behind it.**

Publishing an `llms.txt` is easy ([Engawa](https://github.com/thierry-gilgen-ict/engawa) does it
deterministically). Knowing whether it is the *right* `llms.txt` is not: is the hierarchy real or
one flat `## Pages` list, do the claims agree with the pages, are the important pages there, do the
links point at markdown or at HTML nobody should make an agent parse? This tool answers that.

```
npx llms-txt-doctor https://example.ch
```

Output in `runs/<host>-<stamp>/`: `report.md`, `llms.proposed.txt`, the frozen `case.md`, and the
four reviewer reports.

## How it works: two layers, strictly separated

**Layer 1: deterministic (no AI).** Crawl the site with Engawa's `runInspect` (sitemap, routes,
locales). Fetch `/llms.txt` as raw bytes. Parse it against the
[llmstxt.org v2](https://llmstxt.org/) shape (a port of the reference parser). Fetch every linked
resource. Run the objective checks:

| id | what it catches |
|---|---|
| `ENCODING_*`, `CRLF_LINE_ENDINGS`, `BOM_PRESENT` | invalid UTF-8, mojibake (`Ã¼`), replacement chars, line endings |
| `NO_H1`, `MULTIPLE_H1`, `NO_SUMMARY`, `DEEP_HEADINGS`, `NO_SECTIONS` | shape vs spec |
| `FLAT_HIERARCHY`, `GENERIC_SECTION_NAME`, `EMPTY_SECTION`, `NON_LINK_LINES_IN_SECTION` | hierarchy that tells an agent nothing |
| `DUPLICATE_URL`, `DUPLICATE_TITLE` | the same thing twice |
| `DESC_MISSING`, `DESC_EQUALS_TITLE`, `DESC_TOO_SHORT` | notes that do not say when to fetch |
| `DEAD_LINK` | linked resource not 2xx |
| `HTML_WITHOUT_MD_TWIN`, `HTML_LINKED_MD_EXISTS` | HTML linked although a `.md` twin exists, or no twin at all |
| `CLAIM_NOT_ON_PAGE` | a price in the note that the linked page does not contain |
| `SECTION_TOO_HEAVY`, `CONTEXT_BUDGET` | bytes an agent loads per section (the `llms_txt2ctx` idea) |
| `NO_DESCRIBEDBY_LINK`, `MARKDOWN_COVERAGE`, `SITEMAP_PAGES_NOT_LISTED` | discoverability, counts |

The result is a **frozen case** (`case.md`, sha256 fingerprint): the site as observed, the file
verbatim, what every link actually resolves to, the sitemap pages the file does not mention, and
the findings above. Everything downstream sees only this.

**Layer 2: four blind reviewers + one synthesiser.** The
[Problem Due-Diligence](https://github.com/SensaiXo/problem-due-diligence) pattern, applied to a
file instead of a business idea. Each reviewer runs as a separate headless Claude process with no
tools, no web, no memory, no project settings, and sees only the frozen case. None sees the others.

| lens | question |
|---|---|
| Structure & Hierarchy | Do the H2 sections mirror the site's real architecture? Primary vs secondary at a glance? |
| Positioning & Consistency | One entity, one positioning? Any claim that contradicts another claim or the linked page? |
| Coverage & Priority | Which audience questions can an agent answer from this file alone, and which page is missing? |
| Description & Retrieval | Line by line: does the note say when to fetch, does the URL deliver markdown? |

The synthesiser merges the four reports: convergent findings (two or more blind lenses hitting the
same defect is the strongest signal this method produces), accepted/rejected with reasons, a score,
a verdict (`PUBLISH` / `FIX` / `REWRITE`), a **proposed `llms.txt`** with inferred topical sections
(Core Services, Industries, Guides, Company, Optional, whatever the site actually has), and one
line of reasoning per section and per moved link.

Hard rule for the proposal: it may only link URLs that appear in the case. Where the case does not
give enough to write a truthful note, the note says `(verify: …)` instead of inventing.

**Agent test (measured, not judged).** Borrowed from mcpdoc's two-move agent (read llms.txt,
fetch a link). A sealed question writer sees the site and writes the 10 questions its audience
asks. A sealed agent sees ONLY the llms.txt, picks up to 2 links per question, we fetch them, it
answers or says CANNOT ANSWER. A sealed grader scores each answer CORRECT / WRONG / DECLINED
against the page that holds the fact and the page the agent cited. Output: `8/10 correct, 1 wrong,
1 declined`. WRONG is the number that matters: a file that makes agents invent facts is worse than
one that makes them say "I don't know". The result is appended to the case so the four reviewers
can build on it.

**Generate mode.** Site has no llms.txt? The same crawl feeds a sealed drafter that writes a
first one from the page titles and descriptions, with `(verify: …)` wherever it lacks a fact.
Every URL comes from the crawl; nothing is invented.

**Corpus benchmark.** `bench/corpus.json` holds 2,650 real llms.txt URLs with category tags
(from llms-txt-hub). `node src/bench.mjs --n 300` runs layer 1 over a stratified sample, no AI,
and `node src/bench-summary.mjs` prints the score distribution, per-category medians, how common
each finding is, and what the top-decile files have in common. That is what calibrates the weights. The corpus is third-party and user-submitted: free-hosting user
subdomains are excluded, but treat it as untrusted input and run the benchmark behind an antivirus or
network filter (Avast blocked one entry as malicious on the first run).

## Requirements

- Node 22+ (Engawa itself asks for 24; it loads fine on 22, install with `--ignore-engines`)
- [Claude Code](https://claude.com/claude-code) on PATH and logged in, for layer 2 only.
  `--no-lenses` runs layer 1 alone with no AI at all.

## Options

```
llms-txt-doctor <url> [--out dir] [--model opus|sonnet] [--qa-model sonnet] [--no-lenses] [--no-qa] [--max-pages n] [--json]
```

## What this is not

- Not proof that any agent reads your file. Publishing `llms.txt` guarantees nothing about
  discovery; Engawa's docs are right about that.
- Not a replacement for reading the proposal. Four reviewers agreeing is convergence, not truth.
  Run it twice before acting on a verdict; the lens layer has run-to-run variance.
- Not a crawler of the whole site. `--max-pages` bounds the sitemap sample; the file is curated,
  so a page missing from it is only a finding when a lens argues it matters.

## Relationship to Engawa

Layer 1 respects Engawa's invariant (deterministic, never calls a model) and is written so it could
become `engawa doctor --llms`. Layer 2 deliberately does not belong in Engawa's runtime; it is an
authoring step before publishing.

## Licence

MIT. Reviewer prompts adapted from
[problem-due-diligence](https://github.com/SensaiXo/problem-due-diligence); isolation runner
lifted from its `run.mjs`.
