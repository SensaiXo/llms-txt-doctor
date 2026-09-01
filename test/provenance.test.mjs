import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkProvenance, extractUrls } from '../src/provenance.mjs';

test('all proposed URLs present in the case: ok', () => {
  const caseText = 'Case includes https://x.ch/a.md and https://x.ch/b.md as resolved links.';
  const proposed = '# Site\n\n## Services\n- [A](https://x.ch/a.md): what A covers\n- [B](https://x.ch/b.md): what B covers\n';
  const r = checkProvenance(proposed, caseText);
  assert.equal(r.ok, true);
  assert.deepEqual(r.violations, []);
  assert.deepEqual(r.urls, ['https://x.ch/a.md', 'https://x.ch/b.md']);
});

test('one invented URL: not ok, url listed in violations', () => {
  const caseText = 'Case includes https://x.ch/a.md as a resolved link.';
  const proposed = '# Site\n\n## Services\n- [A](https://x.ch/a.md): real\n- [Ghost](https://x.ch/invented.md): made up\n';
  const r = checkProvenance(proposed, caseText);
  assert.equal(r.ok, false);
  assert.deepEqual(r.violations, ['https://x.ch/invented.md']);
});

test('trailing ):  and other punctuation stripped so a clean URL is compared', () => {
  const caseText = 'Resolved: https://x.ch/case.json is the frozen case.';
  // bare URL immediately followed by a colon (no closing paren between URL and punctuation)
  const proposed = 'See https://x.ch/case.json: the frozen case (https://x.ch/case.json):\n';
  const r = checkProvenance(proposed, caseText);
  assert.deepEqual(r.urls, ['https://x.ch/case.json', 'https://x.ch/case.json']);
  assert.equal(r.ok, true);
});

test('extractUrls strips trailing sentence punctuation', () => {
  assert.deepEqual(extractUrls('Visit https://x.ch/docs. Also https://x.ch/faq, and https://x.ch/end;'), [
    'https://x.ch/docs',
    'https://x.ch/faq',
    'https://x.ch/end',
  ]);
});
