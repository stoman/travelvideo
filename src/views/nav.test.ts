import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderNav } from './nav.ts';

test('renders five translated, locale-prefixed nav links plus the language switch', () => {
  const html = renderNav('en', '/de/trip/china');
  assert.match(html, /href="\/en\/video">Videos/);
  assert.match(html, /href="\/en\/random">Random/);
  assert.match(html, /href="\/en\/map">Map/);
  assert.match(html, /href="\/en\/trip">Trips/);
  assert.match(html, /href="\/en\/about">About/);
  assert.match(html, /href="\/de\/trip\/china">🇩🇪 Deutsch/);
});

test('the switch stamp shows the target locale, not the current one', () => {
  const html = renderNav('de', '/en/trip/china');
  assert.match(html, /href="\/de\/video">Videos/);
  assert.match(html, /href="\/en\/trip\/china">🇬🇧 English/);
});
