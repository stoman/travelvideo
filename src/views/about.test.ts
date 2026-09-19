import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAbout } from './about.ts';

test('about mentions the people-chaining conceit and links to the other views', () => {
  const html = renderAbout();
  assert.match(html, /same people visible/);
  assert.match(html, /href="\/trip"/);
  assert.match(html, /href="\/map"/);
  assert.match(html, /href="\/random"/);
  assert.match(html, /src="\/assets\/us\.jpg"/);
});
