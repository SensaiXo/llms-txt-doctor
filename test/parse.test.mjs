import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLlmsTxt, allLinks } from '../src/parse.mjs';

const sample = `# FastHTML

> FastHTML is a python library.

Remember:

- Use \`serve()\` for running uvicorn

## Docs

- [Quick start](https://fastht.ml/docs/quick.md): A brief overview
- [HTMX reference](https://x.y/ref.md)

## Optional

- [Starlette docs](https://gist.example/s.md): A subset of docs
`;

test('parses spec sample', () => {
  const p = parseLlmsTxt(sample);
  assert.equal(p.title, 'FastHTML');
  assert.equal(p.summary, 'FastHTML is a python library.');
  assert.match(p.info, /Remember:/);
  assert.equal(p.sections.length, 2);
  assert.deepEqual(p.sections.map((s) => s.name), ['Docs', 'Optional']);
  assert.equal(p.sections[0].links[0].desc, 'A brief overview');
  assert.equal(p.sections[0].links[1].desc, '');
  assert.equal(allLinks(p).length, 3);
  assert.equal(p.bom, false);
  assert.equal(p.crlf, false);
});

test('flags BOM, CRLF, stray lines, deep headings, missing summary', () => {
  const p = parseLlmsTxt('\uFEFF# T\r\n\r\n### deep\r\n\r\n## Pages\r\nnot a link\r\n- [a](https://a/b)\r\n');
  assert.equal(p.bom, true);
  assert.equal(p.crlf, true);
  assert.equal(p.summary, null);
  assert.equal(p.deepHeadings.length, 1);
  assert.deepEqual(p.sections[0].stray, ['not a link']);
  assert.equal(p.sections[0].links.length, 1);
});

test('no H1 gives null title', () => {
  const p = parseLlmsTxt('just text\n## S\n- [a](https://a)\n');
  assert.equal(p.title, null);
  assert.equal(p.h1Count, 0);
});
