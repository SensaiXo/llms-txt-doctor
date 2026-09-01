import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runChecks, score } from '../src/checks.mjs';
import { parseLlmsTxt, allLinks } from '../src/parse.mjs';
import { markdownTwinCandidates } from '../src/crawl.mjs';

function mkCase(raw, resources = [], extra = {}) {
  const parsed = parseLlmsTxt(raw);
  return {
    llms: { url: 'https://x.ch/llms.txt', status: 200, contentType: 'text/plain', bytes: raw.length, raw, encoding: { valid: true, mojibake: 0, replacement: 0 }, parsed },
    links: allLinks(parsed),
    resources,
    sitemap: { total: 0, unlisted: 0, unlistedDigest: [], unlistedRest: [] },
    home: { digest: { describedBy: '/llms.txt' }, linkHeader: '' },
    ...extra,
  };
}
const ids = (f) => f.map((x) => x.id);

test('clean file yields no blocking findings', () => {
  const raw = '# Site\n\n> A summary.\n\n## Services\n- [A](https://x.ch/a.md): what A covers for agents\n- [B](https://x.ch/b.md): what B covers for agents\n';
  const f = runChecks(mkCase(raw, [{ status: 200, kind: 'markdown', text: 'a' }, { status: 200, kind: 'markdown', text: 'b' }]));
  assert.equal(f.filter((x) => x.severity === 'BLOCKING').length, 0);
  assert.equal(score(f), 100);
});

test('flat generic section, dup url, dead link, missing desc, claim not on page', () => {
  const raw = '# S\n\n## Pages\n' + Array.from({ length: 8 }, (_, i) => `- [P${i}](https://x.ch/p${i}): note ${i}`).join('\n') + '\n- [P0 again](https://x.ch/p0/)\n- [Price](https://x.ch/price): CHF 2\'200 half day\n';
  const res = Array.from({ length: 11 }, () => ({ status: 200, kind: 'html', text: 'page text', mdTwin: null }));
  res[3] = { status: 404, kind: 'other', text: '' };
  const f = runChecks(mkCase(raw, res));
  const got = ids(f);
  for (const id of ['NO_SUMMARY', 'FLAT_HIERARCHY', 'GENERIC_SECTION_NAME', 'DUPLICATE_URL', 'DEAD_LINK', 'DESC_MISSING', 'CLAIM_NOT_ON_PAGE', 'HTML_WITHOUT_MD_TWIN']) {
    assert.ok(got.includes(id), `missing ${id}`);
  }
  assert.ok(score(f) < 60);
});

test('claim present on page passes', () => {
  const raw = '# S\n\n## A\n- [Price](https://x.ch/price.md): CHF 2\'200 half day\n';
  const f = runChecks(mkCase(raw, [{ status: 200, kind: 'markdown', text: 'Halbtag CHF 2’200 exkl. MwSt' }]));
  assert.ok(!ids(f).includes('CLAIM_NOT_ON_PAGE'));
});

test('markdown twin candidates follow the spec', () => {
  assert.deepEqual(markdownTwinCandidates('https://x.ch/de/page'), ['https://x.ch/de/page.md', 'https://x.ch/de/page/index.md', 'https://x.ch/de/page.html.md']);
  assert.deepEqual(markdownTwinCandidates('https://x.ch/de/page.html'), ['https://x.ch/de/page.html.md', 'https://x.ch/de/page.md']);
  assert.deepEqual(markdownTwinCandidates('https://x.ch/de/'), ['https://x.ch/de/index.md', 'https://x.ch/de/index.html.md', 'https://x.ch/de.md']);
  assert.deepEqual(markdownTwinCandidates('https://x.ch/de/page.md'), []);
});

test('HTML served at /llms.txt is named, not reported as missing H1', () => {
  const raw = '<!DOCTYPE html><html><head><title>x</title></head><body>hi</body></html>';
  const f = runChecks(mkCase(raw, [], { llms: { url: 'https://x.ch/llms.txt', status: 200, contentType: 'text/html; charset=UTF-8', bytes: raw.length, raw, encoding: { valid: true, mojibake: 0, replacement: 0 }, parsed: parseLlmsTxt(raw) } }));
  assert.deepEqual(ids(f), ['LLMS_IS_HTML']);
  assert.equal(f[0].severity, 'BLOCKING');
});
