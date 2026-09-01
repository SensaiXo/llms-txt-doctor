import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { splitPrompt, LENSES } from '../src/lenses.mjs';

test('every lens prompt splits at "## Frozen Case" and carries {{CASE}}', () => {
  for (const l of LENSES) {
    const { system, tail } = splitPrompt(l.prompt, /^## Frozen Case.*$/m);
    assert.ok(system.length > 200, `${l.prompt} system too short`);
    assert.match(tail, /\{\{CASE\}\}/, `${l.prompt} tail lacks {{CASE}}`);
    assert.match(system, /VERDICT: PASS/, `${l.prompt} must demand a VERDICT line`);
  }
});

test('synthesiser carries the case and all four report slots', () => {
  const { tail } = splitPrompt('synthesiser.md', /^## Inputs.*$/m);
  for (const slot of ['CASE', ...LENSES.map((l) => l.slot)]) assert.match(tail, new RegExp(`\\{\\{${slot}\\}\\}`), `missing {{${slot}}}`);
});

test('qa prompts split at "## Inputs" and keep their placeholders', () => {
  const expect = { 'qa-questions.md': ['DIGEST'], 'qa-pick.md': ['LLMS', 'QUESTIONS'], 'qa-answer.md': ['LLMS', 'PAGES', 'QUESTIONS'], 'qa-grade.md': ['ITEMS'] };
  for (const [file, vars] of Object.entries(expect)) {
    const { system, tail } = splitPrompt(file, /^## Inputs.*$/m);
    assert.ok(system.length > 100, `${file} system too short`);
    assert.match(system, /```json/, `${file} must ask for a json block`);
    for (const v of vars) assert.match(tail, new RegExp(`\\{\\{${v}\\}\\}`), `${file} lacks {{${v}}}`);
  }
});

test('no prompt file has an unfilled placeholder in its system half', () => {
  for (const f of readdirSync('prompts').filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const raw = readFileSync(`prompts/${f}`, 'utf8');
    const system = raw.split(/^## (Frozen Case|Inputs).*$/m)[0];
    assert.doesNotMatch(system, /\{\{[A-Z_]+\}\}/, `${f} has a placeholder above the split marker`);
  }
});
