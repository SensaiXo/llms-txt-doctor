# Before/after proof on schnellstart.ai, and `npx is-agent-ready`: design

Date 2026-09-01. Approved in chat by Lukas ("that sounds like an approach I like, go ahead").

## Goal

Prove, with numbers we control, that fixing a site's llms.txt changes what AI agents do:
(a) what an assistant handed the file answers (measured by our agent test), and (b) how often
real crawlers fetch `/llms.txt` and the markdown twins (measured by our own server logs).
schnellstart.ai is the first case. Same method then sells to designtakt (Patrick) and feeds the
benchmark conversation with Thierry (Engawa).

## Non-goals

- No claim about Google, ChatGPT or Perplexity ranking or "AI visibility". METHOD.md in the
  reports repo states this; the spec keeps it.
- No change to Cloudflare bot settings. Probed 2026-09-01: GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, Bingbot all get HTTP 200 text/plain on /llms.txt, no challenge. Leave it.
- No benchmark over third-party corpus sites in this phase (paused after the Avast incident).

## Four workstreams, in order

### W1: publish the tool as `is-agent-ready` on npm

- Rename package to `is-agent-ready` (`llms-txt-doctor` and `is-agentic` are taken).
- `npx is-agent-ready schnellstart.ai` must work: accept a bare hostname, default to https.
- `files` whitelist so `prompts/`, `src/`, `bin/` ship and `examples/`, `bench/`, `runs/`, `docs/`
  do not.
- Default run for an npx user: layer 1 + agent test + lenses require Claude Code on PATH; if
  `claude` is not found, print a clear line and run layer 1 only (never crash).
- Version 0.1.0. Publish is Tier 3: Lukas says "publish" per version.

### W2: fetch logger on schnellstart.ai (who reads the file)

- A Cloudflare Pages Function middleware that runs ONLY for `/llms.txt`, `/llms-ctx*.txt`
  (none today, future-proof) and any path ending in `.md`. It must not run on HTML pages.
- On each request: send one server-side PostHog event `agent_surface_fetch` with properties
  `path`, `ua` (raw user-agent, capped 300 chars), `bot` (classified: gptbot, claudebot,
  perplexitybot, google-extended, googlebot, bingbot, applebot, ccbot, bytespider, meta,
  amazonbot, duckassist, other-bot, browser, unknown), `status` of the response, `country`
  (`cf-ipcountry` header), `ref` (referer if any). `distinct_id` = `bot:<bot>` so PostHog does
  not create one person per IP. No IP stored.
- Never block or slow the response: fire the event with `context.waitUntil(fetch(...))` after
  `next()` returns; on any error, swallow and serve the file.
- Reuse the existing server-side PostHog pattern in the repo (same env var, same endpoint).
- Verify live: after deploy, fetch /llms.txt with a fake `GPTBot` UA and see the event row in
  PostHog within a minute (`npm run ph:url` or the posthog MCP `exec`). Configuration is not
  function: the event row is the proof.
- A daily/weekly count query saved as `scripts/ph-agent-fetches.mjs`: events per `bot` per
  `path` per day, printed as a table, so week-before vs week-after is one command.

### W3: baseline, fix, re-measure (the experiment)

- T0 (today): baseline runs are filed in `agent-readiness-reports/sites/schnellstart.ai/`
  (rule 84, reviewer 38 REWRITE, agent test from the run started 18:5x).
- T0 → T0+7d: logger live, current file untouched. Record fetch counts per bot per path.
- T0+7d: apply the synthesiser's 10-point FIX LIST to `public/llms.txt` (not the whole proposed
  file: the router stays a router, no head prose growth beyond the fix list). Ship. Purge
  Cloudflare cache for /llms.txt. Run the doctor with `--reports` → run 2.
- T0+14d: run 3 (same file, variance check) + second week of fetch counts.
- Result table in `sites/schnellstart.ai/CASE.md`: agent-test wrong count before/after, rule
  score, reviewer score, fetches per bot per path week 1 vs week 2. Every number with a tag.
- What counts as success: agent-test WRONG goes to 0 and DECLINED does not rise; rule score
  ≥ 90; fetch counts reported honestly even if flat (a flat fetch count is a finding, not a
  failure).

### W4: reports repo hygiene

- `sites/schnellstart.ai/CASE.md` written like the others (tagged claims).
- `HISTORY.md` gets a "crawler fetches" table once W2 data exists; the generator reads a small
  JSON the ph script writes (`sites/<host>/fetches.json`).
- Patrick's two sites stay in this private repo; Thierry gets no access to it. Thierry's
  benchmark material is a later, anonymised export.

## Interfaces the plan must respect

- Doctor CLI flags stay: `<url> [--out] [--model] [--qa-model] [--no-lenses] [--no-qa]
  [--max-pages] [--reports] [--json]`.
- `runs.jsonl` row shape (src/ledger.mjs `ledgerRow`) is append-only and must not change
  shape; new fields may be added, none removed.
- PostHog event name `agent_surface_fetch` is the contract between W2 and W3/W4.

## Risks named

- Reviewer and agent-test variance: run 3 exists to show it. Report min/max, not one number.
- The logger sees only requests that reach the origin; Cloudflare cache hits (cache-control
  max-age=3600 on /llms.txt) would be invisible. Mitigation: middleware runs on Pages, which
  is in front of the asset cache for function-routed paths; verify with two fetches in a row
  and check both events arrive. If not, bypass cache for these paths via `_headers`.
- npm name squatting: reserve `is-agent-ready` by publishing 0.1.0 early in W1.
