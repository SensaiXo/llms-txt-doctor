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
