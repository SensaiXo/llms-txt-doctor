import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claudeAvailable } from '../src/claude-available.mjs';

test('returns false when PATH is empty', () => assert.equal(claudeAvailable({ PATH: '', Path: '' }), false));
test('returns a boolean for the real PATH', () => assert.equal(typeof claudeAvailable(process.env), 'boolean'));
