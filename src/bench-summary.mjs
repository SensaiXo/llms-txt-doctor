#!/usr/bin/env node
// Summarise bench/results.jsonl: score distribution, per-category medians, how common each finding is,
// and what the top-decile files have in common. Usage: node src/bench-summary.mjs [bench/results.jsonl]
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'bench/results.jsonl';
const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const okRows = rows.filter((r) => !r.error && r.llmsStatus === 200);
const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };
const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);

console.log(`sites: ${rows.length}, fetch errors: ${rows.filter((r) => r.error).length}, llms.txt not 200: ${rows.filter((r) => !r.error && r.llmsStatus !== 200).length}, scored: ${okRows.length}`);
const scores = okRows.map((r) => r.score);
console.log(`score p10 ${q(scores, 0.1)}  p25 ${q(scores, 0.25)}  median ${q(scores, 0.5)}  p75 ${q(scores, 0.75)}  p90 ${q(scores, 0.9)}`);
console.log(`has H1 ${pct(okRows.filter((r) => r.hasH1).length, okRows.length)}%  has summary ${pct(okRows.filter((r) => r.hasSummary).length, okRows.length)}%  has Optional ${pct(okRows.filter((r) => r.hasOptional).length, okRows.length)}%`);
console.log(`median links ${q(okRows.map((r) => r.links), 0.5)}  median sections ${q(okRows.map((r) => r.sections), 0.5)}  median bytes ${q(okRows.map((r) => r.bytes), 0.5)}`);
const mdShare = okRows.filter((r) => r.links).map((r) => r.mdLinks / r.links);
const descShare = okRows.filter((r) => r.links).map((r) => r.withDesc / r.links);
console.log(`links pointing at .md: median ${Math.round(100 * q(mdShare, 0.5))}%  (p75 ${Math.round(100 * q(mdShare, 0.75))}%)   links with a description: median ${Math.round(100 * q(descShare, 0.5))}%`);

console.log('\nfinding frequency (share of sites with ≥1):');
const freq = {};
for (const r of okRows) for (const id of Object.keys(r.ids)) freq[id] = (freq[id] ?? 0) + 1;
for (const [id, n] of Object.entries(freq).sort((a, b) => b[1] - a[1])) console.log(`  ${String(pct(n, okRows.length)).padStart(3)}%  ${id}`);

console.log('\nper category (n, median score):');
const cats = {};
for (const r of okRows) (cats[r.category] ??= []).push(r.score);
for (const [c, s] of Object.entries(cats).sort((a, b) => b[1].length - a[1].length)) if (s.length >= 5) console.log(`  ${c.padEnd(24)} ${String(s.length).padStart(4)}  ${q(s, 0.5)}`);

const top = okRows.filter((r) => r.score >= (q(scores, 0.9) ?? 100));
console.log(`\ntop decile (${top.length} sites, score ≥ ${q(scores, 0.9)}): has summary ${pct(top.filter((r) => r.hasSummary).length, top.length)}%, has Optional ${pct(top.filter((r) => r.hasOptional).length, top.length)}%, median sections ${q(top.map((r) => r.sections), 0.5)}, median links ${q(top.map((r) => r.links), 0.5)}`);
const names = {};
for (const r of top) for (const n of r.sectionNames) names[n.toLowerCase()] = (names[n.toLowerCase()] ?? 0) + 1;
console.log('  most common section names in top decile: ' + Object.entries(names).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([n, c]) => `${n} (${c})`).join(', '));
