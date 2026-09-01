# is-agent-ready: design (2026-09-01)

Goal: close the gap between "Engawa can publish an llms.txt" and "help me build the right one".
Input: a public site URL. Output: audit report + a proposed corrected llms.txt + reasoning.

Two layers, strictly separated:

1. Deterministic layer (`src/`): no model calls. Crawl via Engawa `runInspect`, fetch
   `/llms.txt` raw bytes, parse against the llmstxt.org v2 shape (H1, `>` summary, prose,
   H2 link lists `- [title](url): notes`, `## Optional`). Run objective checks (encoding,
   structure, duplicates, dead links, HTML links without a `.md` twin, sitemap pages not
   listed, claims in llms.txt not found on the linked page). Produce a frozen case
   (`case.md` + `case.json`, sha256 fingerprint). This layer is Engawa-upstreamable.
2. Lens layer (`prompts/`, `src/lenses.mjs`): the Problem Due-Diligence pattern. Four blind
   reviewers, four separate `claude -p` processes, no tools, no memory, each sees only the
   frozen case. A synthesiser merges them into: score, convergent findings, verdict
   (PUBLISH / FIX / REWRITE), a proposed llms.txt with inferred sections, and reasoning.

Rules: never invent pages (proposed file may only link URLs present in the case);
reviewers never see each other; a run is reproducible from `case.json` alone.
