#!/usr/bin/env node
// Corpus benchmark: layer 1 only (no model), over real llms.txt files from the llms-txt-hub
// directory (bench/corpus.json, 2,650 sites with category tags). Answers "what does a typical
// llms.txt score, and what do the good ones do?" so the weights are calibrated on reality, not
// on one site. The corpus is THIRD-PARTY and user-submitted: free-hosting user subdomains
// (github.io, vercel.app, …) are stripped at extraction time, and one entry was blocked by Avast
// as URL:Mal on 2026-09-01. Node fetch runs no site code, but run this behind an antivirus /
// network filter anyway and never point it at a corpus you have not looked at. Usage: node src/bench.mjs [--n 300] [--category developer-tools] [--concurrency 4]
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { crawl } from './crawl.mjs';
import { runChecks, score } from './checks.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const N = Number(opt('--n', 300));
const CAT = opt('--category', null);
const CONC = Number(opt('--concurrency', 4));
const OUT = opt('--out', 'bench/results.jsonl');

const corpus = JSON.parse(readFileSync('bench/corpus.json', 'utf8')).filter((s) => !CAT || s.category === CAT);
// Stratified, deterministic sample: every k-th site of the alphabetically sorted corpus.
corpus.sort((a, b) => a.website.localeCompare(b.website));
const step = Math.max(1, Math.floor(corpus.length / N));
const sample = corpus.filter((_, i) => i % step === 0).slice(0, N);
const done = new Set(existsSync(OUT) ? readFileSync(OUT, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).website) : []);
const todo = sample.filter((s) => !done.has(s.website));
console.log(`bench: ${sample.length} sites sampled from ${corpus.length}, ${todo.length} to do, ${CONC} at a time → ${OUT}`);

let i = 0, ok = 0, fail = 0;
async function one(site) {
  const t0 = Date.now();
  try {
    const c = await crawl(site.website, { maxPages: 5, timeoutMs: 8000, light: true, llmsUrl: site.llmsUrl });
    const findings = runChecks(c);
    const ids = {};
    for (const f of findings) ids[f.id] = (ids[f.id] ?? 0) + 1;
    const p = c.llms.parsed;
    const row = {
      website: site.website, category: site.category, ms: Date.now() - t0,
      llmsStatus: c.llms.status, bytes: c.llms.bytes, score: score(findings),
      hasH1: Boolean(p?.title), hasSummary: Boolean(p?.summary), sections: p?.sections.length ?? 0,
      sectionNames: p?.sections.map((s) => s.name) ?? [], links: c.links.length,
      mdLinks: c.links.filter((l) => /\.md$/i.test(l.url)).length,
      withDesc: c.links.filter((l) => l.desc).length,
      hasOptional: p?.sections.some((s) => /^optional$/i.test(s.name)) ?? false,
      blocking: findings.filter((f) => f.severity === 'BLOCKING').length,
      advisory: findings.filter((f) => f.severity === 'ADVISORY').length,
      ids,
    };
    appendFileSync(OUT, JSON.stringify(row) + '\n');
    ok++;
  } catch (e) {
    appendFileSync(OUT, JSON.stringify({ website: site.website, category: site.category, error: String(e.message ?? e).slice(0, 200) }) + '\n');
    fail++;
  }
  i++;
  if (i % 10 === 0) console.log(`  ${i}/${todo.length}  ok ${ok}  fail ${fail}`);
}
await Promise.all(Array.from({ length: CONC }, async () => { while (todo.length) await one(todo.shift()); }));
console.log(`done: ok ${ok}, fail ${fail}`);
