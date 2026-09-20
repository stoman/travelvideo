import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickLocale, isLocale } from './locale.ts';

test('isLocale accepts only supported locales', () => {
  assert.equal(isLocale('en'), true);
  assert.equal(isLocale('de'), true);
  assert.equal(isLocale('fr'), false);
  assert.equal(isLocale(''), false);
});

test('pickLocale matches the first supported primary subtag', () => {
  assert.equal(pickLocale(['de-DE', 'en-US']), 'de');
  assert.equal(pickLocale(['en-US', 'de-DE']), 'en');
  assert.equal(pickLocale(['de']), 'de');
});

test('pickLocale skips unsupported tags before finding a match', () => {
  assert.equal(pickLocale(['fr-FR', 'de-CH']), 'de');
});

test('pickLocale falls back to the default when nothing matches', () => {
  assert.equal(pickLocale(['fr-FR', 'es-ES']), 'en');
  assert.equal(pickLocale([]), 'en');
});
