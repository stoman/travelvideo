import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAbout } from './about.ts';

test('about mentions the people-chaining conceit and links to the other views', () => {
  const html = renderAbout('en');
  assert.match(html, /same people visible/);
  assert.match(html, /href="\/en\/trip"/);
  assert.match(html, /href="\/en\/map"/);
  assert.match(html, /href="\/en\/random"/);
  assert.match(html, /src="\/assets\/us\.jpg"/);
});

test('renders translated German prose with locale-prefixed links', () => {
  const html = renderAbout('de');
  assert.match(html, /Willkommen auf unserer Reise-Karte/);
  assert.match(html, /href="\/de\/trip"/);
  assert.match(html, /href="\/de\/map"/);
  assert.match(html, /href="\/de\/random"/);
});
