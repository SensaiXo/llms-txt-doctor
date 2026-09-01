import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTarget } from '../src/target.mjs';

test('bare host gets https', () => assert.equal(normalizeTarget('schnellstart.ai'), 'https://schnellstart.ai/'));
test('scheme kept', () => assert.equal(normalizeTarget('http://localhost:8080/x'), 'http://localhost:8080/x'));
test('www and path kept', () => assert.equal(normalizeTarget('www.designtakt.ch/services'), 'https://www.designtakt.ch/services'));
test('garbage throws', () => assert.throws(() => normalizeTarget('not a url at all'), /not a URL/));
