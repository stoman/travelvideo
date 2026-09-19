import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderCountryOverview } from './country-overview.ts';
import { getCountryGroup } from '../data/index.ts';

test('lists every video in the country, individually linked, no watch-all CTA', () => {
  const group = getCountryGroup('new-zealand')!;
  const html = renderCountryOverview(group);
  assert.match(html, /<h1>New Zealand<\/h1>/);
  assert.match(html, /href="\/video\/hobbiton"/);
  assert.doesNotMatch(html, /cta-stamp/);
});

test('shows the video count', () => {
  const group = getCountryGroup('new-zealand')!;
  const html = renderCountryOverview(group);
  assert.match(html, new RegExp(`<p>${group.videos.length} videos</p>`));
});
