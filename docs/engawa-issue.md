Hi Thierry,

I tested Engawa against a real llms.txt case and found one gap that I think could make it much more useful, so I built a prototype to show what I mean rather than only describe it.

## The gap

Engawa is already strong at exposing Markdown, llms.txt and MCP, but it assumes the operator already knows what the correct information architecture is. `buildLlmsTxt` will happily emit one flat `## Pages` list with `Field Note: <slug>` descriptions, and `engawa doctor` will pass it, because it exists and references markdown. What is missing is an **audit / authoring layer before publishing**: inspect the real site, compare it with the current llms.txt, find the problems, score them, and propose a corrected file with the reasoning.

## The prototype

https://github.com/SensaiXo/llms-txt-doctor (MIT)

Two layers, strictly separated, on purpose:

1. **Deterministic, no model calls.** Crawls the site with your `runInspect`, fetches `/llms.txt` as raw bytes, parses it against llmstxt.org v2 (a port of the reference parser), fetches every linked resource, and runs ~22 objective checks: encoding/mojibake/CRLF, H1 + summary present, flat hierarchy, generic section names, non-link lines under an H2, duplicate URLs, dead links, **HTML linked although a `.md` twin exists**, a price in the note that the linked page does not contain, bytes an agent loads per section, `rel="describedby"` present. This layer respects Engawa's invariant and is written so it could become `engawa doctor --llms` (or a `--audit` profile). Happy to open a PR for that part if you want it.
2. **Four blind reviewers + a synthesiser** (the pattern from https://github.com/SensaiXo/problem-due-diligence). Each reviewer is a separate headless model process with no tools, no web, no memory, and sees only the frozen case from layer 1: Structure & Hierarchy, Positioning & Consistency, Coverage & Priority, Description & Retrieval. The synthesiser marks findings that two or more blind reviewers hit independently as convergent, gives a verdict (PUBLISH / FIX / REWRITE) and writes a **proposed llms.txt** with topical sections plus one line of reasoning per section and per moved link. Hard rule: it may only link URLs that appear in the crawl. This layer deliberately does not belong in Engawa's runtime.

Also in there: an **agent test** (a sealed model gets only the llms.txt plus up to two fetches per question and has to answer the ten questions the site's audience actually asks; a grader counts CORRECT / WRONG / DECLINED, so coverage becomes a measurement rather than an opinion), and a **generate mode** for sites with no llms.txt yet.

## Two example runs

I ran it on my own site and, since it is the first production reference, on yours. Both came back REWRITE. That is the point of the tool, not a criticism of either site.

- **schnellstart.ai**: 38/100, agent test 8/10. Convergent findings: client-proof pages missing, one term ("Standortbestimmung") used for a paid and a free product so the price answer is undecidable, 14 notes that just repeat the title, one H2 that is prose instead of links. https://github.com/SensaiXo/llms-txt-doctor/blob/main/examples/schnellstart.ai/report.md
- **thierry-gilgen-ict.ch**: 9/100, agent test 8/10. Convergent findings (4/4 reviewers): all 44 links in one `## Pages` section; 0 of 44 links point at markdown although 41 `.md` twins exist on the site; 38 notes read `Field Note: <slug>` while every page has a real description; `[FAQ]` points at `/about`; `/contact` sits in Optional; the site's own six-hub Library taxonomy is flattened away. Proposed file with 34 verified links: https://github.com/SensaiXo/llms-txt-doctor/blob/main/examples/thierry-gilgen-ict.ch/llms.proposed.txt, full report: https://github.com/SensaiXo/llms-txt-doctor/blob/main/examples/thierry-gilgen-ict.ch/report.md

The second run is, I think, the strongest argument: the file was produced by Engawa's own generator, passes `engawa doctor`, and still makes an agent parse HTML for content the site already publishes as markdown.

## Proposal

- Layer 1 upstream as `engawa doctor --llms` (deterministic, read-only, no model). I can prepare the PR against `packages/cli/src/doctor/` following CONTRIBUTING.
- Layer 2 stays a separate authoring tool that consumes Engawa's inspect output, referenced from `docs/llms-txt-authoring.md` as "how to know whether your llms.txt is any good".
- Two small generator changes that the corpus of real files argues for: allow named sections instead of only `Pages` / `Optional`, and warn (or fail with `requireMarkdown`) when a resource's `canonicalUrl` is HTML while a markdown twin is registered.

Caveats, stated openly: the reviewer layer has run-to-run variance (run twice before acting), four models agreeing is convergence not truth, and none of this proves any agent reads the file, which your docs are right about.

Would you take the layer-1 PR? And I would like your view on the section-naming point before I build more on it.

Lukas
