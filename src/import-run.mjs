#!/usr/bin/env node
// File an EXISTING run folder (made before --reports existed) into a reports repo.
// Usage: node src/import-run.mjs <run-dir> <reports-dir> [--stamp 2026-09-01T16-40-00] [--model opus]
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ledgerRow, fileRun } from './ledger.mjs';

const [runDir, reportsDir] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
if (!runDir || !reportsDir) { console.error('usage: import-run <run-dir> <reports-dir> [--stamp s] [--model m]'); process.exit(1); }

const cj = JSON.parse(readFileSync(join(runDir, 'case.json'), 'utf8'));
const host = new URL(cj.origin).hostname;
const findings = cj.findings;
const read = (f) => (existsSync(join(runDir, f)) ? readFileSync(join(runDir, f), 'utf8') : '');
const qaLine = read('qa.md').match(/answered (\d+)\/(\d+) correctly, (\d+) WRONG[^,]*, (\d+) declined/);
const qa = qaLine ? { summary: { correct: +qaLine[1], total: +qaLine[2], wrong: +qaLine[3], declined: +qaLine[4] } } : null;
const syn = read('synthesis.md');
const lens = syn ? { score: Number(syn.match(/SCORE:\s*(\d+)/)?.[1] ?? NaN) || null, verdict: syn.match(/VERDICT:\s*(PUBLISH|FIX|REWRITE)/)?.[1] ?? null, reports: ['structure', 'positioning', 'coverage', 'retrieval'].map((k) => ({ verdict: read(`${k}.md`).match(/VERDICT:\s*(PASS|BLOCKING)/)?.[1] ?? 'UNKNOWN' })) } : null;
const gen = existsSync(join(runDir, 'generate.md')) ? {} : null;
const { score } = await import('./checks.mjs');
const stamp = opt('--stamp', new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19));
const row = ledgerRow({ host, stamp, fingerprint: cj.fingerprint, detScore: score(findings), findings, qa, lens, gen, model: opt('--model', 'opus') });
const siteDir = fileRun(reportsDir, host, stamp, runDir, row);
console.log(`filed ${runDir} → ${siteDir}/runs/${stamp}`);
console.log(JSON.stringify(row));
