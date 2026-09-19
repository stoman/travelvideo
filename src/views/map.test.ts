import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMap } from './map.ts';

test('renders a map-view labelled heading', () => {
  const html = renderMap();
  assert.match(html, /class="map-view"/);
  assert.match(html, />Map<\/h1>/);
});
