// Agent Q&A test. Mirrors the mcpdoc flow (list llms.txt → pick links → fetch → answer) but
// with the fetching done deterministically by us, so the "agent" process stays sealed:
// no tools, no memory, only the llms.txt and the pages it asked for.
//
//   question writer  sees the SITE digest, never the llms.txt   → 10 audience questions
//   agent step 1     sees ONLY the llms.txt                      → which links to fetch (≤2/question)
//   we               fetch those links (same-origin or listed)   → page text, capped
//   agent step 2     sees llms.txt + fetched pages               → answers or CANNOT ANSWER
//   grader           sees expected page text + answer            → CORRECT / WRONG / DECLINED
//
// Result: a measurement ("with only your llms.txt an agent answered 6/10, got 2 wrong") instead
// of an opinion. WRONG is the number that matters: a file that makes agents invent facts is
// worse than one that makes them say "I don't know".
import { rmSync, readFileSync } from 'node:fs';
import { fetchRaw, decodeUtf8, isHtml, htmlToText } from './fetch.mjs';
import { runIsolated, splitPrompt, makeSandbox } from './lenses.mjs';

const PAGE_CAP = 12_000;
const cap = (s, n) => (s && s.length > n ? s.slice(0, n) + '…' : s ?? '');

function parseJson(text) {
  const m = text.match(/```json\s*\n([\s\S]*?)\n```/) ?? text.match(/(\[[\s\S]*\])/);
  if (!m) throw new Error('no JSON block in model output');
  return JSON.parse(m[1]);
}

function siteDigest(c) {
  const i = c.inspect;
  const L = [`site: ${c.origin}`, `title: ${cap(i.site.title, 200)}`, `description: ${cap(i.site.metaDescription, 400)}`, '', 'pages (url | title | description):'];
  c.links.forEach((l, k) => { const h = c.resources[k]?.html ?? {}; L.push(`- ${l.url} | ${cap(h.title || l.title, 120)} | ${cap(h.description, 200)}`); });
  for (const u of c.sitemap.unlistedDigest) L.push(`- ${u.url} | ${cap(u.title, 120)} | ${cap(u.description, 200)}`);
  return L.join('\n');
}

async function fetchText(url, cache, timeoutMs) {
  if (cache.has(url)) return cache.get(url);
  const r = await fetchRaw(url, { timeoutMs });
  let text = '';
  if (r.ok) {
    const t = decodeUtf8(r.bytes).text;
    text = isHtml(r.contentType) ? htmlToText(t) : t;
  }
  const out = { url, status: r.status, text: text.slice(0, PAGE_CAP) };
  cache.set(url, out);
  return out;
}

// questionsFile: JSON array of { q, expectUrl, expectFact }. A FROZEN set makes runs comparable
// (pre-registered benchmarking); without it a sealed writer generates fresh questions each run.
export async function runQa(c, { model = 'sonnet', timeoutMs = 10_000, onStep = () => {}, questionsFile = null } = {}) {
  const sandbox = makeSandbox();
  const cache = new Map();
  // Seed the cache with what the crawl already fetched so the agent's picks cost nothing extra.
  c.links.forEach((l, k) => { const r = c.resources[k]; if (r?.text) cache.set(l.url, { url: l.url, status: r.status, text: r.text.slice(0, PAGE_CAP) }); });
  const listed = new Set(c.links.map((l) => l.url));
  const sameOrigin = (u) => { try { return new URL(u).origin === c.origin; } catch { return false; } };
  const ask = async (file, vars, label) => {
    onStep(label, false);
    const { system, tail } = splitPrompt(file, /^## Inputs.*$/m);
    let user = tail;
    for (const [k, v] of Object.entries(vars)) user = user.split(`{{${k}}}`).join(v);
    const out = await runIsolated(sandbox, model, system, user);
    onStep(label, true);
    return out;
  };
  try {
    const questions = (questionsFile
      ? JSON.parse(readFileSync(questionsFile, 'utf8'))
      : parseJson(await ask('qa-questions.md', { DIGEST: siteDigest(c) }, 'questions'))).slice(0, 10);
    if (questionsFile) onStep('questions (frozen set)', true);
    const qText = questions.map((q, i) => `${i}. ${q.q}`).join('\n');
    const picks = parseJson(await ask('qa-pick.md', { LLMS: c.llms.raw, QUESTIONS: qText }, 'pick'));
    const wanted = new Set();
    for (const p of picks) for (const u of (p.urls ?? []).slice(0, 2)) if (listed.has(u) || sameOrigin(u)) wanted.add(u);
    onStep(`fetch ${wanted.size} page(s)`, false);
    const pages = [];
    for (const u of wanted) pages.push(await fetchText(u, cache, timeoutMs));
    onStep(`fetch ${wanted.size} page(s)`, true);
    const pagesText = pages.map((p) => `### ${p.url} (HTTP ${p.status})\n${p.text || '(empty)'}`).join('\n\n') || '(no pages fetched)';
    const answers = parseJson(await ask('qa-answer.md', { LLMS: c.llms.raw, PAGES: pagesText, QUESTIONS: qText }, 'answer'));
    const items = [];
    for (let i = 0; i < questions.length; i++) {
      const exp = await fetchText(questions[i].expectUrl, cache, timeoutMs);
      const a = answers.find((x) => x.i === i) ?? { answer: 'CANNOT ANSWER', source: null };
      items.push({ i, question: questions[i].q, expectUrl: questions[i].expectUrl, expectFact: questions[i].expectFact, expectText: exp.text, answer: a.answer, source: a.source, fetched: (picks.find((p) => p.i === i)?.urls ?? []) });
    }
    // The grader must see everything the assistant saw: the llms.txt itself (facts in the head
    // and in link notes are legitimately "supported") and every page it fetched for the item,
    // plus the page the question writer expected. 2026-09-01: four schnellstart answers were
    // graded WRONG for facts that sat in the file or in the second fetched page.
    const pageTexts = new Map();
    for (const it of items) for (const u of it.fetched.slice(0, 2)) {
      if (!pageTexts.has(u) && (listed.has(u) || sameOrigin(u))) pageTexts.set(u, (await fetchText(u, cache, timeoutMs)).text);
    }
    const itemsText = buildGradeItems(items, c.llms.raw, pageTexts);
    const grades = parseJson(await ask('qa-grade.md', { ITEMS: itemsText }, 'grade'));
    for (const it of items) { const g = grades.find((x) => x.i === it.i); it.grade = g?.grade ?? 'UNGRADED'; it.why = g?.why ?? ''; }
    const n = (g) => items.filter((it) => it.grade === g).length;
    const summary = { correct: n('CORRECT'), wrong: n('WRONG'), declined: n('DECLINED'), total: items.length };
    return { summary, items, model };
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

export function formatQa(qa) {
  const s = qa.summary;
  const L = [`## Agent test (measured, model ${qa.model})`, `With ONLY the llms.txt and up to 2 fetches per question, an agent answered ${s.correct}/${s.total} correctly, ${s.wrong} WRONG (invented or contradicted), ${s.declined} declined.`, ''];
  for (const it of qa.items) L.push(`- [${it.grade}] ${it.question}\n  answer: ${cap(it.answer, 300)}\n  fetched: ${it.fetched.join(', ') || 'nothing'}; expected: ${it.expectUrl}${it.why ? `\n  grader: ${it.why}` : ''}`);
  return L.join('\n') + '\n';
}

export function buildGradeItems(items, llmsRaw, pageTexts) {
  const head = `llms.txt (the file the assistant was given):\n${llmsRaw.trim()}\n\n`;
  return head + items.map((it) => {
    const fetched = it.fetched.slice(0, 2).map((u) => `Fetched page (${u}):\n${cap(pageTexts.get(u) ?? '', PAGE_CAP) || '(not fetched)'}`).join('\n');
    return `### ${it.i}\nQ: ${it.question}\nExpected fact: ${it.expectFact}\nExpected page (${it.expectUrl}):\n${cap(it.expectText, PAGE_CAP) || '(page not fetchable)'}\n${fetched}\nAssistant answer: ${it.answer}`;
  }).join('\n\n');
}
