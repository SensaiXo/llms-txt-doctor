# Before/after proof on schnellstart.ai + `npx is-agent-ready`: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the doctor as `npx is-agent-ready <host>`, log who fetches schnellstart.ai's llms.txt and markdown twins into PostHog, and run a filed before/after experiment (baseline → fix → re-measure) whose every number is source-tagged in the private reports repo.

**Architecture:** Three repos, no new services. (1) `C:/Dev/llms-txt-doctor` (the tool, public, Node ESM, no build): grader fix, rename, npm publish. (2) `C:/Dev/schnellstart` (Astro on Cloudflare Pages): one root `functions/_middleware.js` that early-returns for every path except `/llms.txt` and `*.md`, fires one server-side PostHog event via `waitUntil`, plus a HogQL count script. (3) `C:/Dev/agent-readiness-reports` (private): filed runs, CASE.md, a crawler-fetch table in HISTORY.md.

**Tech Stack:** Node 22 ESM, `node --test`, Cloudflare Pages Functions (`onRequest(context)` with `next()` and `waitUntil`), PostHog EU capture API (`POST https://eu.i.posthog.com/capture/`) and HogQL query API, npm publish.

**Spec:** `docs/superpowers/specs/2026-09-01-before-after-proof-design.md`

## Global Constraints

- Tool package name: `is-agent-ready`; command: `npx is-agent-ready schnellstart.ai` (bare host allowed, https assumed). Version `0.1.0`.
- `files` whitelist: `["bin", "src", "prompts", "README.md", "LICENSE"]`. `prompts/` is read at runtime by `src/lenses.mjs:11`; it must ship.
- If the `claude` CLI is not on PATH: print one line, run layer 1 only, exit 0. Never crash.
- PostHog event name: `agent_surface_fetch`. `distinct_id` = `bot:<bot>`. No IP stored. Reuse `POSTHOG_PROJECT_KEY` (fallbacks `POSTHOG_PUBLIC_KEY`, `VITE_POSTHOG_KEY`) and host `env.POSTHOG_CAPTURE_HOST || 'https://eu.i.posthog.com'`, exactly as `functions/api/calcom/webhook.js:48-99` does.
- Middleware must never delay or alter the file response: `const res = await next();` first, then `waitUntil(capture)`, wrapped in try/catch.
- Middleware runs on every request (no `_routes.json` in the repo; Cloudflare's default already invokes the Functions router on all requests). It must return `next()` on the first line for any path that is not `/llms.txt` or does not end in `.md`.
- schnellstart quality gates before ship: `npm run design:lint`, `npm run i18n:full` (pre-commit), `tsc --noEmit`, and the `goal-gap-check` workflow. `npm run ship` is Tier 3: ask Lukas per deploy with current state / what changes / how to undo.
- `npm publish` is Tier 3: ask Lukas per version.
- Reports repo rules (README.md there): every CASE.md claim carries a tag; runs are append-only; no private data.
- No em dashes in any copy.

---

### Task 1: Grader sees the llms.txt and every page the agent fetched

The 2026-09-01 schnellstart baseline graded 4 answers WRONG for facts that are in the llms.txt itself or in the second fetched page, which the grader never saw.

**Files:**
- Modify: `C:/Dev/llms-txt-doctor/src/qa.mjs:82-91` (items → itemsText)
- Modify: `C:/Dev/llms-txt-doctor/prompts/qa-grade.md`
- Test: `C:/Dev/llms-txt-doctor/test/qa-grade-input.test.mjs`

**Interfaces:**
- Produces: `export function buildGradeItems(items, llmsRaw, pageTexts)` in `src/qa.mjs` returning the string handed to the grader; `pageTexts` is `Map<url, string>`.

- [ ] **Step 1: Write the failing test**

```js
// test/qa-grade-input.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGradeItems } from '../src/qa.mjs';

test('grader input carries the llms.txt and every fetched page for the item', () => {
  const items = [{ i: 0, question: 'Q?', expectFact: 'F', expectUrl: 'https://x.ch/a', expectText: 'page A text', answer: 'ans', source: 'https://x.ch/b', fetched: ['https://x.ch/b', 'https://x.ch/c'] }];
  const pages = new Map([['https://x.ch/b', 'page B text'], ['https://x.ch/c', 'page C text']]);
  const out = buildGradeItems(items, '# Site\n> summary line', pages);
  assert.match(out, /llms\.txt \(the file the assistant was given\):\n# Site/);
  assert.match(out, /Fetched page \(https:\/\/x\.ch\/b\):\npage B text/);
  assert.match(out, /Fetched page \(https:\/\/x\.ch\/c\):\npage C text/);
  assert.match(out, /Expected page \(https:\/\/x\.ch\/a\):\npage A text/);
  assert.match(out, /Assistant answer: ans/);
});
```

- [ ] **Step 2: Run it, expect failure**

Run: `cd C:/Dev/llms-txt-doctor && node --test test/qa-grade-input.test.mjs`
Expected: FAIL, `buildGradeItems` is not exported.

- [ ] **Step 3: Implement**

In `src/qa.mjs`, replace the block from the comment `// 2026-09-01 designtakt run:` through the `const itemsText = …` line with:

```js
    // The grader must see everything the assistant saw: the llms.txt itself (facts in the head
    // and in link notes are legitimately "supported") and every page it fetched for the item,
    // plus the page the question writer expected. 2026-09-01: four schnellstart answers were
    // graded WRONG for facts that sat in the file or in the second fetched page.
    const pageTexts = new Map();
    for (const it of items) for (const u of it.fetched.slice(0, 2)) {
      if (!pageTexts.has(u) && (listed.has(u) || sameOrigin(u))) pageTexts.set(u, (await fetchText(u, cache, timeoutMs)).text);
    }
    const itemsText = buildGradeItems(items, c.llms.raw, pageTexts);
```

Add after `formatQa` at the bottom of the file:

```js
export function buildGradeItems(items, llmsRaw, pageTexts) {
  const head = `llms.txt (the file the assistant was given):\n${llmsRaw.trim()}\n\n`;
  return head + items.map((it) => {
    const fetched = it.fetched.slice(0, 2).map((u) => `Fetched page (${u}):\n${cap(pageTexts.get(u) ?? '', PAGE_CAP) || '(not fetched)'}`).join('\n');
    return `### ${it.i}\nQ: ${it.question}\nExpected fact: ${it.expectFact}\nExpected page (${it.expectUrl}):\n${cap(it.expectText, PAGE_CAP) || '(page not fetchable)'}\n${fetched}\nAssistant answer: ${it.answer}`;
  }).join('\n\n');
}
```

Delete the now-unused `it.sourceText` loop and the `src` variable if nothing else references them.

In `prompts/qa-grade.md` replace the two grading-rule lines with:

```
- `CORRECT`: the answer states the expected fact or an equivalent, and nothing in it contradicts
  the pages or the llms.txt.
- `WRONG`: the answer asserts something that none of the provided material supports (not the
  expected page, not any fetched page, not the llms.txt itself), or that any of them contradicts.
  Extra detail that IS in the provided material is not wrong.
- `DECLINED`: assistant said CANNOT ANSWER (honest gap).
```

and change the intro sentence to: "For each item you get: the llms.txt the assistant was given, the question, the expected fact and the text of the page that holds it, the text of every page the assistant fetched for that question, and the assistant's answer."

- [ ] **Step 4: Run all tests**

Run: `node --test test/*.test.mjs`
Expected: all pass (`test/prompts.test.mjs` still finds `{{ITEMS}}` under `## Inputs`).

- [ ] **Step 5: Re-run the baseline once to see the effect and file it**

Run: `node bin/llms-txt-doctor.mjs https://schnellstart.ai --no-lenses --max-pages 60 --reports C:/Dev/agent-readiness-reports`
Expected: a new row in `C:/Dev/agent-readiness-reports/sites/schnellstart.ai/runs.jsonl`; WRONG count should drop from 4. Record the number in the commit message. Then in the reports repo: `git add -A && git commit -m "reports: schnellstart.ai run 3, grader v3 (sees llms.txt + fetched pages)"`.

- [ ] **Step 6: Commit**

```bash
cd C:/Dev/llms-txt-doctor && git add src/qa.mjs prompts/qa-grade.md test/qa-grade-input.test.mjs && git commit -m "qa: grader sees the llms.txt and every fetched page

Four schnellstart answers were graded WRONG for facts present in the file head
or in the second fetched page. Grader now receives the file and both pages."
```

---

### Task 2: Rename to `is-agent-ready`, bare-host input, graceful no-claude mode, LICENSE

**Files:**
- Modify: `C:/Dev/llms-txt-doctor/package.json`
- Rename: `bin/llms-txt-doctor.mjs` → `bin/is-agent-ready.mjs`
- Create: `C:/Dev/llms-txt-doctor/src/target.mjs`, `C:/Dev/llms-txt-doctor/src/claude-available.mjs`, `C:/Dev/llms-txt-doctor/LICENSE`
- Modify: `src/fetch.mjs:2` (USER_AGENT), `README.md` (title, lines 12 and 97), `docs/SPEC.md:1`
- Test: `test/target.test.mjs`, `test/claude-available.test.mjs`

**Interfaces:**
- Produces: `normalizeTarget(input: string): string` (throws `Error('not a URL: …')` on garbage); `claudeAvailable(): boolean`.

- [ ] **Step 1: Failing tests**

```js
// test/target.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTarget } from '../src/target.mjs';

test('bare host gets https', () => assert.equal(normalizeTarget('schnellstart.ai'), 'https://schnellstart.ai/'));
test('scheme kept', () => assert.equal(normalizeTarget('http://localhost:8080/x'), 'http://localhost:8080/x'));
test('www and path kept', () => assert.equal(normalizeTarget('www.designtakt.ch/services'), 'https://www.designtakt.ch/services'));
test('garbage throws', () => assert.throws(() => normalizeTarget('not a url at all'), /not a URL/));
```

```js
// test/claude-available.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claudeAvailable } from '../src/claude-available.mjs';

test('returns false when PATH is empty', () => assert.equal(claudeAvailable({ PATH: '', Path: '' }), false));
test('returns a boolean for the real PATH', () => assert.equal(typeof claudeAvailable(process.env), 'boolean'));
```

- [ ] **Step 2: Run, expect failure**

Run: `node --test test/target.test.mjs test/claude-available.test.mjs`
Expected: FAIL, modules missing.

- [ ] **Step 3: Implement**

```js
// src/target.mjs
// `npx is-agent-ready schnellstart.ai` must work: no scheme → https.
export function normalizeTarget(input) {
  const s = String(input ?? '').trim();
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  let u;
  try { u = new URL(withScheme); } catch { throw new Error(`not a URL: ${input}`); }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname) && u.hostname !== 'localhost') throw new Error(`not a URL: ${input}`);
  return u.href;
}
```

```js
// src/claude-available.mjs
// Layer 2 (reviewers, agent test, drafter) needs the Claude Code CLI. Without it we run layer 1 only.
import { existsSync } from 'node:fs';
import { join, delimiter } from 'node:path';
export function claudeAvailable(env = process.env) {
  const path = env.PATH ?? env.Path ?? '';
  const names = process.platform === 'win32' ? ['claude.cmd', 'claude.exe', 'claude'] : ['claude'];
  return path.split(delimiter).filter(Boolean).some((dir) => names.some((n) => existsSync(join(dir, n))));
}
```

`git mv bin/llms-txt-doctor.mjs bin/is-agent-ready.mjs`, then in that file:
- line 2 comment and line 15 usage string: replace `llms-txt-doctor` with `is-agent-ready`.
- add imports: `import { normalizeTarget } from '../src/target.mjs';` and `import { claudeAvailable } from '../src/claude-available.mjs';`
- replace `const url = args.find((a) => !a.startsWith('--'));` and the usage guard with:

```js
const rawTarget = args.find((a) => !a.startsWith('--'));
if (!rawTarget) { console.error('usage: is-agent-ready <host or url> [--out dir] [--model opus|sonnet] [--qa-model sonnet] [--no-lenses] [--no-qa] [--max-pages n] [--reports dir] [--json]'); process.exit(1); }
let url;
try { url = normalizeTarget(rawTarget); } catch (e) { console.error(e.message); process.exit(1); }
const hasClaude = claudeAvailable();
if (!hasClaude && !args.includes('--no-lenses')) console.error('claude CLI not found on PATH: running the rule checks only (install Claude Code for the agent test and the four reviewers)');
```

- change `const noLenses = args.includes('--no-lenses');` to `const noLenses = args.includes('--no-lenses') || !hasClaude;`
- change the QA guard `if (!args.includes('--no-qa') && c.llms.parsed)` to `if (!args.includes('--no-qa') && hasClaude && c.llms.parsed)`.

`package.json`: `"name": "is-agent-ready"`, `"bin": { "is-agent-ready": "./bin/is-agent-ready.mjs" }`, add `"files": ["bin", "src", "prompts", "README.md", "LICENSE"]`, add `"repository": { "type": "git", "url": "git+https://github.com/SensaiXo/llms-txt-doctor.git" }`, keep `"version": "0.1.0"`.

`src/fetch.mjs:2`: `export const USER_AGENT = 'is-agent-ready/0.1 (+https://github.com/SensaiXo/llms-txt-doctor)';`

`README.md`: title `# is-agent-ready`, line 12 `npx is-agent-ready schnellstart.ai`, usage line `is-agent-ready <host or url> …`, and one sentence under Requirements: "Without Claude Code on PATH the command runs the rule checks only and says so."

`LICENSE`: standard MIT text, `Copyright (c) 2026 Lukas Huber`.

- [ ] **Step 4: Run tests and a smoke run**

Run: `node --test test/*.test.mjs` → all pass.
Run: `node bin/is-agent-ready.mjs schnellstart.ai --no-lenses --no-qa --max-pages 5` → prints the rule findings, exit 0.
Run: `PATH= node bin/is-agent-ready.mjs schnellstart.ai --max-pages 5` (Git Bash) → prints the "claude CLI not found" line and the rule findings, exit 0.
Run: `npm pack --dry-run` → the file list shows `bin/`, `src/`, `prompts/`, `README.md`, `LICENSE`, `package.json` and nothing from `examples/`, `bench/`, `docs/`, `test/`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: is-agent-ready: rename, bare host input, rule-only mode without claude, LICENSE"
```

---

### Task 3: Publish 0.1.0 to npm (Tier 3)

**Files:** none new.

- [ ] **Step 1: Lukas logs in** (interactive, cannot be done by the agent): in the terminal `! npm login`, then `! npm whoami` shows the account.
- [ ] **Step 2: Ask Lukas** with the three lines: current state (name free, `npm pack --dry-run` list verified), what changes (public package `is-agent-ready@0.1.0` appears on npm under his account), how to undo (`npm unpublish is-agent-ready@0.1.0` within 72 h, or `npm deprecate` after).
- [ ] **Step 3: On "publish":** `cd C:/Dev/llms-txt-doctor && npm publish --access public`.
- [ ] **Step 4: Verify live:** in a fresh temp dir `npx --yes is-agent-ready@0.1.0 schnellstart.ai --no-lenses --no-qa --max-pages 5` runs and prints findings. `npm view is-agent-ready version` → `0.1.0`.
- [ ] **Step 5: Tag** `git tag v0.1.0 && git push origin main --tags`.

---

### Task 4: Fetch logger middleware on schnellstart.ai

**Files:**
- Create: `C:/Dev/schnellstart/functions/_middleware.js`
- Create: `C:/Dev/schnellstart/functions/agent-surface-log.mjs` (pure helpers, imported by the middleware and the test)
- Test: `C:/Dev/schnellstart/functions/agent-surface-log.test.mjs`
- Modify: `C:/Dev/schnellstart/package.json` scripts: add `"test:agent-log": "node --test functions/agent-surface-log.test.mjs"` and append ` && npm run test:agent-log` to whatever umbrella script runs `test:webhook` (grep `test:webhook` in package.json and any `.husky`/pre-push script; if none, add the new script next to `test:locale` and note it in ARCHITECTURE.md).
- Modify: `C:/Dev/schnellstart/ARCHITECTURE.md` (one line under Cloudflare Functions: the middleware and the event name).

**Interfaces:**
- Produces: `classifyBot(ua: string): string` returning one of `gptbot, chatgpt-user, oai-searchbot, claudebot, claude-user, anthropic-ai, perplexitybot, perplexity-user, google-extended, googlebot, bingbot, applebot, ccbot, bytespider, meta-externalagent, amazonbot, duckassistbot, mistralai, cohere-ai, youbot, other-bot, browser, unknown`; `shouldLog(pathname: string): boolean`; `buildEvent(request: Request, status: number, apiKey: string): object` (the PostHog capture body).
- Event contract: `event: 'agent_surface_fetch'`, `distinct_id: 'bot:<bot>'`, `properties: { path, ua, bot, status, country, ref, $lib: 'cf-pages-middleware' }`.

- [ ] **Step 1: Failing test**

```js
// functions/agent-surface-log.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyBot, shouldLog, buildEvent } from './agent-surface-log.mjs';

test('shouldLog only for llms.txt and markdown twins', () => {
  assert.equal(shouldLog('/llms.txt'), true);
  assert.equal(shouldLog('/de/pricing.md'), true);
  assert.equal(shouldLog('/de.md'), true);
  assert.equal(shouldLog('/de/pricing'), false);
  assert.equal(shouldLog('/'), false);
  assert.equal(shouldLog('/blog/rss.xml'), false);
  assert.equal(shouldLog('/_astro/x.md.js'), false);
});

test('classifyBot names the big AI crawlers and falls back sanely', () => {
  assert.equal(classifyBot('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)'), 'gptbot');
  assert.equal(classifyBot('Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'), 'claudebot');
  assert.equal(classifyBot('Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'), 'perplexitybot');
  assert.equal(classifyBot('Google-Extended'), 'google-extended');
  assert.equal(classifyBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), 'googlebot');
  assert.equal(classifyBot('curl/8.4.0'), 'other-bot');
  assert.equal(classifyBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'), 'browser');
  assert.equal(classifyBot(''), 'unknown');
  assert.equal(classifyBot('is-agent-ready/0.1 (+https://github.com/SensaiXo/llms-txt-doctor)'), 'other-bot');
});

test('buildEvent has the contract shape and no IP', () => {
  const req = new Request('https://schnellstart.ai/de/pricing.md', { headers: { 'user-agent': 'GPTBot/1.2', 'cf-ipcountry': 'CH', referer: 'https://chat.openai.com/', 'cf-connecting-ip': '1.2.3.4' } });
  const ev = buildEvent(req, 200, 'phc_test');
  assert.equal(ev.event, 'agent_surface_fetch');
  assert.equal(ev.api_key, 'phc_test');
  assert.equal(ev.distinct_id, 'bot:gptbot');
  assert.deepEqual(Object.keys(ev.properties).sort(), ['$lib', 'bot', 'country', 'path', 'ref', 'status', 'ua']);
  assert.equal(ev.properties.path, '/de/pricing.md');
  assert.equal(ev.properties.country, 'CH');
  assert.equal(ev.properties.status, 200);
  assert.ok(!JSON.stringify(ev).includes('1.2.3.4'));
  assert.ok(typeof ev.timestamp === 'string');
});

test('ua is capped at 300 chars', () => {
  const req = new Request('https://schnellstart.ai/llms.txt', { headers: { 'user-agent': 'x'.repeat(1000) } });
  assert.equal(buildEvent(req, 200, 'k').properties.ua.length, 300);
});
```

- [ ] **Step 2: Run, expect failure**

Run: `cd C:/Dev/schnellstart && node --test functions/agent-surface-log.test.mjs`
Expected: FAIL, module missing.

- [ ] **Step 3: Implement the helpers**

```js
// functions/agent-surface-log.mjs
// Pure helpers for the agent-surface fetch logger. No I/O here so the test needs no network.
const BOTS = [
  ['gptbot', /gptbot/i], ['chatgpt-user', /chatgpt-user/i], ['oai-searchbot', /oai-searchbot/i],
  ['claudebot', /claudebot/i], ['claude-user', /claude-user/i], ['anthropic-ai', /anthropic-ai/i],
  ['perplexitybot', /perplexitybot/i], ['perplexity-user', /perplexity-user/i],
  ['google-extended', /google-extended/i], ['googlebot', /googlebot/i], ['bingbot', /bingbot/i],
  ['applebot', /applebot/i], ['ccbot', /ccbot/i], ['bytespider', /bytespider/i],
  ['meta-externalagent', /meta-externalagent|facebookexternalhit/i], ['amazonbot', /amazonbot/i],
  ['duckassistbot', /duckassistbot/i], ['mistralai', /mistralai/i], ['cohere-ai', /cohere-ai/i], ['youbot', /youbot/i],
];
const BROWSER = /mozilla\/5\.0 .*(chrome|safari|firefox|edg)\//i;

export function classifyBot(ua) {
  const s = String(ua ?? '').trim();
  if (!s) return 'unknown';
  for (const [name, re] of BOTS) if (re.test(s)) return name;
  if (BROWSER.test(s) && !/bot|crawl|spider|fetch|curl|wget|python|node|go-http|java/i.test(s)) return 'browser';
  return 'other-bot';
}

export function shouldLog(pathname) {
  if (pathname === '/llms.txt' || pathname.startsWith('/llms-')) return pathname.endsWith('.txt');
  return /\.md$/i.test(pathname) && !pathname.startsWith('/_astro/');
}

export function buildEvent(request, status, apiKey) {
  const url = new URL(request.url);
  const ua = (request.headers.get('user-agent') ?? '').slice(0, 300);
  const bot = classifyBot(ua);
  return {
    api_key: apiKey,
    event: 'agent_surface_fetch',
    distinct_id: `bot:${bot}`,
    properties: {
      path: url.pathname,
      ua,
      bot,
      status,
      country: request.headers.get('cf-ipcountry') ?? '',
      ref: (request.headers.get('referer') ?? '').slice(0, 300),
      $lib: 'cf-pages-middleware',
    },
    timestamp: new Date().toISOString(),
  };
}
```

```js
// functions/_middleware.js
// Logs every fetch of /llms.txt and of a markdown twin (*.md) as a server-side PostHog event, so
// "does any AI crawler read our agent surface" is a number, not a guess. Runs on every request
// (no _routes.json in this project), so the first line must be the cheap early return.
// Never delays or changes the response: next() first, capture in waitUntil, errors swallowed.
import { shouldLog, buildEvent } from './agent-surface-log.mjs';

const DEFAULT_HOST = 'https://eu.i.posthog.com';

export async function onRequest(context) {
  const { request, env, next, waitUntil } = context;
  const { pathname } = new URL(request.url);
  if (!shouldLog(pathname)) return next();
  const res = await next();
  try {
    const apiKey = env.POSTHOG_PROJECT_KEY || env.POSTHOG_PUBLIC_KEY || env.VITE_POSTHOG_KEY;
    if (apiKey) {
      const host = (env.POSTHOG_CAPTURE_HOST || DEFAULT_HOST).replace(/\/$/, '');
      const body = JSON.stringify(buildEvent(request, res.status, apiKey));
      waitUntil(fetch(`${host}/capture/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {}));
    }
  } catch {}
  return res;
}
```

- [ ] **Step 4: Run tests**

Run: `node --test functions/agent-surface-log.test.mjs` → 4 pass. Then `npm run test:webhook && npm run test:locale` → still pass (middleware must not break existing function tests; they import handlers directly, so no change expected).

- [ ] **Step 5: Local behaviour check without Cloudflare**

Cloudflare's runtime is not available locally in this repo (no wrangler config). Verify the module loads and the early return path is correct with a tiny script:

Run:
```bash
node --input-type=module -e "
import { onRequest } from './functions/_middleware.js';
const mk = (u, ua='GPTBot/1.2') => ({ request: new Request(u, { headers: { 'user-agent': ua } }), env: { POSTHOG_PROJECT_KEY: 'phc_x', POSTHOG_CAPTURE_HOST: 'http://127.0.0.1:9' }, next: async () => new Response('ok', { status: 200 }), waitUntil: (p) => p });
const a = await onRequest(mk('https://schnellstart.ai/de/pricing')); console.log('page', a.status);
const b = await onRequest(mk('https://schnellstart.ai/llms.txt')); console.log('llms', b.status, await b.text());
"
```
Expected: `page 200` and `llms 200 ok`; no throw even though the capture host is unreachable.

- [ ] **Step 6: Commit (local only)**

```bash
git add functions/_middleware.js functions/agent-surface-log.mjs functions/agent-surface-log.test.mjs package.json ARCHITECTURE.md
git commit -m "feat(functions): log llms.txt and markdown-twin fetches to PostHog

agent_surface_fetch event, distinct_id bot:<name>, no IP. Middleware early-returns
for every other path and never delays the file response."
```

---

### Task 5: Fetch-count report script

**Files:**
- Create: `C:/Dev/schnellstart/scripts/ph-agent-fetches.mjs`
- Test: `C:/Dev/schnellstart/scripts/ph-agent-fetches.test.mjs`
- Modify: `C:/Dev/schnellstart/package.json` scripts: `"ph:agent-fetches": "node scripts/ph-agent-fetches.mjs"`

**Interfaces:**
- Consumes: env `POSTHOG_PERSONAL_API_KEY`, `POSTHOG_PROJECT_ID`, optional `POSTHOG_API_HOST` (same as `scripts/posthog-query.mjs:29-31`).
- Produces: `export function aggregate(rows: Array<[day, bot, path, count]>): { byBot: Record<bot, number>, byPath: Record<path, number>, byDay: Record<day, number>, total: number }`; CLI prints a table and, with `--out <file>`, writes `{ from, to, days, byBot, byPath, byDay, total }` as JSON (this is the `fetches.json` Task 7 reads).

- [ ] **Step 1: Failing test**

```js
// scripts/ph-agent-fetches.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregate } from './ph-agent-fetches.mjs';

test('aggregate sums by bot, path and day', () => {
  const a = aggregate([['2026-09-02', 'gptbot', '/llms.txt', 3], ['2026-09-02', 'claudebot', '/de/pricing.md', 1], ['2026-09-03', 'gptbot', '/llms.txt', 2]]);
  assert.deepEqual(a.byBot, { gptbot: 5, claudebot: 1 });
  assert.deepEqual(a.byPath, { '/llms.txt': 5, '/de/pricing.md': 1 });
  assert.deepEqual(a.byDay, { '2026-09-02': 4, '2026-09-03': 2 });
  assert.equal(a.total, 6);
});
```

- [ ] **Step 2: Run, expect failure** — `node --test scripts/ph-agent-fetches.test.mjs` → FAIL.

- [ ] **Step 3: Implement**

```js
#!/usr/bin/env node
// Counts agent_surface_fetch events (who fetched /llms.txt and the .md twins) per bot / path / day.
// Usage: node scripts/ph-agent-fetches.mjs [--days 7] [--out sites/schnellstart.ai/fetches.json]
// Auth: same env as scripts/posthog-query.mjs (POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID).
import { writeFileSync } from 'node:fs';

export function aggregate(rows) {
  const byBot = {}, byPath = {}, byDay = {};
  let total = 0;
  for (const [day, bot, path, n] of rows) {
    byBot[bot] = (byBot[bot] ?? 0) + n; byPath[path] = (byPath[path] ?? 0) + n; byDay[day] = (byDay[day] ?? 0) + n; total += n;
  }
  return { byBot, byPath, byDay, total };
}

async function hogql(query) {
  const HOST = process.env.POSTHOG_API_HOST?.replace('i.posthog.com', 'posthog.com') || 'https://eu.posthog.com';
  const KEY = process.env.POSTHOG_PERSONAL_API_KEY, PROJECT = process.env.POSTHOG_PROJECT_ID;
  if (!KEY || !PROJECT) throw new Error('set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID (see scripts/posthog-query.mjs)');
  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, { method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }) });
  if (!res.ok) throw new Error(`query ${res.status}: ${await res.text()}`);
  return (await res.json()).results;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
  const args = process.argv.slice(2);
  const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
  const days = Number(opt('--days', 7));
  const rows = await hogql(`SELECT toDate(timestamp) AS day, properties.bot AS bot, properties.path AS path, count() AS n FROM events WHERE event = 'agent_surface_fetch' AND timestamp >= now() - INTERVAL ${days} DAY GROUP BY day, bot, path ORDER BY day, n DESC`);
  const agg = aggregate(rows.map(([d, b, p, n]) => [String(d).slice(0, 10), b ?? 'unknown', p ?? '', Number(n)]));
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`agent_surface_fetch, last ${days} days: ${agg.total} fetch(es)\n`);
  console.log('by bot'); for (const [b, n] of Object.entries(agg.byBot).sort((x, y) => y[1] - x[1])) console.log(`  ${pad(b, 20)} ${n}`);
  console.log('by path'); for (const [p, n] of Object.entries(agg.byPath).sort((x, y) => y[1] - x[1])) console.log(`  ${pad(p, 48)} ${n}`);
  console.log('by day'); for (const [d, n] of Object.entries(agg.byDay)) console.log(`  ${d} ${n}`);
  const out = opt('--out', null);
  if (out) { writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), days, ...agg }, null, 2)); console.log(`\nwritten ${out}`); }
}
```

- [ ] **Step 4: Run test** → pass. Run the CLI against live PostHog once (expect `0 fetch(es)` before Task 6 deploys; that is fine and proves auth works): `npm run ph:agent-fetches -- --days 1`.

- [ ] **Step 5: Commit** `git add scripts/ph-agent-fetches.mjs scripts/ph-agent-fetches.test.mjs package.json && git commit -m "feat(scripts): agent fetch counts per bot/path/day from PostHog"`.

---

### Task 6: Deploy the logger and prove it fires (Tier 3)

**Files:** none new.

- [ ] **Step 1: Gates** in `C:/Dev/schnellstart`: `git status` (only Task 4/5 files staged; `npm run ship` uploads a dirty tree, so stash or commit anything else first), `npx tsc --noEmit`, `npm run design:lint`, `npm run test:agent-log`, `npm run test:webhook`.
- [ ] **Step 2: goal-gap-check** workflow with `args.areas = [{ key: 'agent-log', claims: ['functions/_middleware.js early-returns for non-agent paths', 'agent_surface_fetch event has no IP field', 'existing function tests still pass'] }]`.
- [ ] **Step 3: Ask Lukas** (three lines): current state (llms.txt fetches are invisible; middleware committed locally, tests green), what changes (production deploy adds a middleware on every request that only acts on /llms.txt and *.md and posts one PostHog event per such fetch), how to undo (`git revert <sha> && npm run ship`, or delete `functions/_middleware.js` and ship).
- [ ] **Step 4: On "ship":** `npm run ship`.
- [ ] **Step 5: Verify live (configuration is not function).**
  `curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot/1.2 (+https://openai.com/gptbot)" https://schnellstart.ai/llms.txt` twice, and once for `https://schnellstart.ai/de/pricing.md` with `-A "ClaudeBot/1.0"`. Then within 2 minutes:
  `npm run ph:agent-fetches -- --days 1` → shows `gptbot 2` and `claudebot 1` (or use the posthog MCP `exec` with HogQL `SELECT properties.bot, properties.path, count() FROM events WHERE event='agent_surface_fetch' AND timestamp > now() - INTERVAL 10 MINUTE GROUP BY 1,2`). Both fetches of /llms.txt must appear: if only one does, the edge cache swallowed the second and `public/_headers` needs `Cache-Control: no-store` (or `s-maxage=0`) for `/llms.txt` and `/*.md`, then reship.
  Also confirm the response is unchanged: `curl -sI https://schnellstart.ai/llms.txt | grep -i content-type` → `text/plain; charset=utf-8`.
- [ ] **Step 6: Record** the deploy time and the proof (event rows) in `C:/Dev/agent-readiness-reports/sites/schnellstart.ai/CASE.md` under "Measurement window" (T0 = deploy timestamp). Commit both repos.

---

### Task 7: Reports: schnellstart CASE.md and crawler-fetch table in HISTORY.md

**Files:**
- Create: `C:/Dev/agent-readiness-reports/sites/schnellstart.ai/CASE.md`
- Modify: `C:/Dev/llms-txt-doctor/src/ledger.mjs` (`renderHistory` reads optional `fetches.json` next to `runs.jsonl`)
- Test: `C:/Dev/llms-txt-doctor/test/ledger.test.mjs` (add one test)

**Interfaces:**
- Consumes: `fetches.json` shape from Task 5: `{ generated, days, byBot, byPath, byDay, total }`. Multiple windows are stored as `fetches/<label>.json` (e.g. `fetches/week-before.json`, `fetches/week-after.json`); HISTORY renders one table per file, sorted by name.

- [ ] **Step 1: Failing test** (append to `test/ledger.test.mjs`)

```js
test('renderHistory renders crawler fetch windows when fetches/*.json exist', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  writeFileSync(join(dir, 'runs.jsonl'), JSON.stringify(ledgerRow({ host: 'x.ch', stamp: 's', fingerprint: 'a', detScore: 50, findings: [], qa: null, lens: null, gen: null, model: 'none' })) + '\n');
  mkdirSync(join(dir, 'fetches'));
  writeFileSync(join(dir, 'fetches', 'week-before.json'), JSON.stringify({ generated: 't', days: 7, byBot: { gptbot: 4, browser: 9 }, byPath: { '/llms.txt': 10, '/de/pricing.md': 3 }, byDay: {}, total: 13 }));
  const h = renderHistory(dir);
  assert.match(h, /## Crawler fetches/);
  assert.match(h, /week-before .*7 days.*13 fetch/);
  assert.match(h, /gptbot 4/);
  assert.match(h, /\/llms\.txt 10/);
});
```
Add `mkdirSync` to the fs import at the top of the test file.

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement** in `src/ledger.mjs`: add `readdirSync` to the fs import, and before `return L.join('\n') + '\n';` in `renderHistory`:

```js
  const fdir = join(siteDir, 'fetches');
  if (existsSync(fdir)) {
    const files = readdirSync(fdir).filter((f) => f.endsWith('.json')).sort();
    if (files.length) {
      L.push('', '## Crawler fetches (agent_surface_fetch events, our own Cloudflare middleware)', '');
      for (const f of files) {
        const w = JSON.parse(readFileSync(join(fdir, f), 'utf8'));
        const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${v}`).join(', ');
        L.push(`- **${f.replace(/\.json$/, '')}** (${w.days} days, generated ${w.generated}): ${w.total} fetch(es). By bot: ${top(w.byBot) || 'none'}. By path: ${top(w.byPath) || 'none'}.`);
      }
      L.push('', 'A fetch is a request that reached our origin. Browser and other-bot rows are people and generic tools; the AI-crawler rows are the ones the experiment is about.');
    }
  }
```

- [ ] **Step 4: Run tests** → pass. Commit in the tool repo: `git commit -am "ledger: render crawler fetch windows in HISTORY.md"`.

- [ ] **Step 5: Write `sites/schnellstart.ai/CASE.md`** following the designtakt one: headline; scores table for runs 1–3 with tags; the findings that stand (from `runs/2026-09-01T14-45-00/synthesis.md` FIX LIST, each with `[page: public/llms.txt line n]`, `[rule: id]`, `[reviewer n/4]`); the agent-test wrong answers with `[measured: qa item n]`; a "Measurement window" section with T0 (Task 6 deploy time), planned T0+7d and T0+14d; "What we do not claim" (copy from METHOD.md). Commit in the reports repo.

---

### Task 8: The experiment itself (calendar-driven)

**Files:**
- Modify: `C:/Dev/schnellstart/public/llms.txt` (at T0+7d only)
- Modify: `C:/Dev/schnellstart/TASKS.md` (two dated items now)
- Modify: `C:/Dev/agent-readiness-reports/sites/schnellstart.ai/CASE.md`, `HISTORY.md` (generated), `fetches/*.json`

- [ ] **Step 1 (now): put the two dates in `C:/Dev/schnellstart/TASKS.md`** under an "llms.txt before/after" heading: `T0+7d`: run `npm run ph:agent-fetches -- --days 7 --out C:/Dev/agent-readiness-reports/sites/schnellstart.ai/fetches/week-before.json`, then apply the FIX LIST, ship, purge cache for `/llms.txt`, run `node bin/is-agent-ready.mjs schnellstart.ai --reports C:/Dev/agent-readiness-reports`. `T0+14d`: `npm run ph:agent-fetches -- --days 7 --out …/fetches/week-after.json`, run the doctor again, fill CASE.md results table. Also add the two dates to the project memory file `project_llms_txt_doctor.md`.
- [ ] **Step 2 (T0+7d): apply the fix list, not the whole proposal.** Edit `public/llms.txt` with the Edit tool only (translations rule does not apply, but keep LF endings: the build gate `scripts/verify-llms-txt.mjs` checks the file). The ten items from `runs/2026-09-01T14-45-00/synthesis.md` FIX LIST: add an `## Ergebnisse & Fallstudien` section linking `/de/erfolgsgeschichten` and the four case pages plus `/de/case-studies/workshops`; add the `/de/check` line under Standortbestimmung with the "free self-check, not the paid audit" note; replace the six one-word Industries notes with the pages' own meta descriptions; move the four "Suitable Use Cases" bullets into one head sentence and delete that H2; delete "DACH-Region", "Wincare", the three "90-day roadmap" repeats; reconcile the hosting sentence; add `/de/about`, `/de/contact`, `/de/datenschutz`, replace the four blog posts with `/de/blog`; pricing note names `CHF 450/h` and `ab CHF 2'200`; rename the call line to "Erstgespräch (Klartext-Call)"; give the four free sessions their durations. Keep the file under 7 KB. Do NOT add prose beyond the one use-case sentence (memory: the router stays a router).
- [ ] **Step 3 (T0+7d): gates and ship.** `npm run build` locally must pass (`verify-llms-txt.mjs` cross-checks the `.md` routes), goal-gap-check with claims = the ten fixes, ask Lukas, `npm run ship`, then purge Cloudflare cache for `https://schnellstart.ai/llms.txt` (memory: `reference_cloudflare_cache_purge`), confirm with `curl -s https://schnellstart.ai/llms.txt | grep -c "Erfolgsgeschichten"` → ≥1.
- [ ] **Step 4 (T0+7d): run 4** `node bin/is-agent-ready.mjs schnellstart.ai --reports C:/Dev/agent-readiness-reports`; commit the reports repo.
- [ ] **Step 5 (T0+14d): run 5 and the after-window** as in Step 1; commit.
- [ ] **Step 6 (T0+14d): results in CASE.md.** A table: agent-test correct/wrong/declined per run, reviewer score and verdict per run, rule score per run, fetches by AI bot week-before vs week-after, each cell tagged. One paragraph of plain-language conclusion that only says what the numbers say. Then the one-line recap for Lukas and the material for Patrick (same method, his sites) and Thierry (anonymised: scores and deltas only).

---

## Self-review

- Spec coverage: W1 → Tasks 2, 3. W2 → Tasks 4, 5, 6. W3 → Task 8 (baseline already filed; Task 1 re-files with the fixed grader). W4 → Task 7. Cloudflare non-goal respected (no bot-setting changes). Cache risk handled in Task 6 Step 5. npm name reservation in Task 3.
- Placeholders: none; every code step has code. Task 8 Step 2 lists the ten concrete edits rather than "apply fixes".
- Type consistency: `buildGradeItems(items, llmsRaw, pageTexts: Map)` used in Task 1 only; `normalizeTarget` / `claudeAvailable` defined and consumed in Task 2; event contract fields (`path, ua, bot, status, country, ref, $lib`) identical in Task 4 test, Task 4 code, Task 5 HogQL (`properties.bot`, `properties.path`), Task 7 reads `byBot/byPath/byDay/total` which Task 5 writes.
