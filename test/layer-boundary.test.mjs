// Layer 1 (deterministic: crawl, parse, checks, case, ledger, bench, target, claude-available,
// provenance) must never touch the AI runner (lenses.mjs spawning `claude`, or qa.mjs). Blindness
// is a process boundary; this test keeps it that way by scanning source text, not by mocking.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const DETERMINISTIC_FILES = [
  'parse.mjs', 'fetch.mjs', 'crawl.mjs', 'checks.mjs', 'case.mjs', 'ledger.mjs',
  'bench.mjs', 'bench-summary.mjs', 'target.mjs', 'claude-available.mjs', 'provenance.mjs',
];
const FORBIDDEN = [/lenses\.mjs/, /qa\.mjs/, /spawn\(/, /'claude'/, /"claude"/];
// claude-available.mjs's whole job is checking whether the `claude` binary exists on PATH
// (a filesystem stat, never a spawn); it legitimately contains the literal string 'claude'
// as a binary name to look for. That is not "touching the AI runner", so it is exempt from
// the bare-string patterns only, not from the spawn(/lenses.mjs/qa.mjs patterns.
const EXEMPT_FROM_STRING_CHECK = new Set(['claude-available.mjs']);

for (const file of DETERMINISTIC_FILES) {
  test(`${file} does not touch the AI runner`, () => {
    const text = readFileSync(join(SRC, file), 'utf8');
    for (const re of FORBIDDEN) {
      if (EXEMPT_FROM_STRING_CHECK.has(file) && /claude/.test(re.source) && re.source !== 'spawn\\(') continue;
      assert.ok(!re.test(text), `${file} matches forbidden pattern ${re}`);
    }
  });
}

test('lenses.mjs and qa.mjs are not imported by any deterministic-layer file', () => {
  for (const file of DETERMINISTIC_FILES) {
    const text = readFileSync(join(SRC, file), 'utf8');
    assert.ok(!/from\s+['"].*lenses\.mjs['"]/.test(text), `${file} imports lenses.mjs`);
    assert.ok(!/from\s+['"].*qa\.mjs['"]/.test(text), `${file} imports qa.mjs`);
  }
});
