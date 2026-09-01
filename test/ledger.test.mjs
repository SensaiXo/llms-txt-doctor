import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ledgerRow, renderHistory } from '../src/ledger.mjs';

const findings = [
  { id: 'DEAD_LINK', severity: 'BLOCKING' }, { id: 'DESC_MISSING', severity: 'ADVISORY' }, { id: 'DESC_MISSING', severity: 'ADVISORY' }, { id: 'MARKDOWN_COVERAGE', severity: 'INFO' },
];

test('ledgerRow captures scores, counts and finding ids', () => {
  const r = ledgerRow({ host: 'x.ch', stamp: 's1', fingerprint: 'abc', detScore: 70, findings, qa: { summary: { correct: 7, wrong: 2, declined: 1, total: 10 } }, lens: { score: 15, verdict: 'REWRITE', reports: [{ verdict: 'BLOCKING' }, { verdict: 'PASS' }] }, gen: null, model: 'opus' });
  assert.equal(r.blocking, 1); assert.equal(r.advisory, 2); assert.equal(r.ids.DESC_MISSING, 2);
  assert.equal(r.qa.wrong, 2); assert.equal(r.lensScore, 15); assert.equal(r.verdict, 'REWRITE'); assert.equal(r.reviewersBlocking, 1);
});

test('renderHistory shows before → after between first and latest run', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  const r1 = ledgerRow({ host: 'x.ch', stamp: '2026-09-01', fingerprint: 'a', detScore: 40, findings, qa: { summary: { correct: 7, wrong: 2, declined: 1, total: 10 } }, lens: { score: 15, verdict: 'REWRITE', reports: [] }, gen: null, model: 'opus' });
  const r2 = ledgerRow({ host: 'x.ch', stamp: '2026-09-08', fingerprint: 'b', detScore: 85, findings: [{ id: 'NO_DESCRIBEDBY_LINK', severity: 'INFO' }], qa: { summary: { correct: 10, wrong: 0, declined: 0, total: 10 } }, lens: { score: 80, verdict: 'PUBLISH', reports: [] }, gen: null, model: 'opus' });
  writeFileSync(join(dir, 'runs.jsonl'), JSON.stringify(r1) + '\n' + JSON.stringify(r2) + '\n');
  const h = renderHistory(dir);
  assert.match(h, /rule score: 40 → 85 \(\+45\)/);
  assert.match(h, /wrong answers: 2 → 0 \(-2\)/);
  assert.match(h, /findings resolved: DEAD_LINK, DESC_MISSING, MARKDOWN_COVERAGE/);
  assert.match(h, /findings new: NO_DESCRIBEDBY_LINK/);
  assert.match(h, /REWRITE → PUBLISH/);
});

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
