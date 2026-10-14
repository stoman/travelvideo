import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderCountryOverview } from './country-overview.ts';
import { getCountryGroup } from '../data/index.ts';

test('lists every video in the country, individually linked, no watch-all CTA', () => {
  const group = getCountryGroup('new-zealand')!;
  const html = renderCountryOverview(group, 'en');
  assert.match(html, /<h1>New Zealand<\/h1>/);
  assert.match(html, /href="\/en\/video\/hobbiton"/);
  assert.doesNotMatch(html, /cta-stamp/);
});

test('shows the video count', () => {
  const group = getCountryGroup('new-zealand')!;
  const html = renderCountryOverview(group, 'en');
  assert.match(html, new RegExp(`<p>${group.videos.length} videos</p>`));
});

test('German: translated country name in heading, slug-based href unchanged', () => {
  const group = getCountryGroup('new-zealand')!;
  const html = renderCountryOverview(group, 'de');
  assert.match(html, /<h1>Neuseeland<\/h1>/);
  assert.match(html, /href="\/de\/video\/hobbiton"/);
  assert.match(html, new RegExp(`<p>${group.videos.length} Videos</p>`));
});

test('a country whose raw name differs from its proper English display name', () => {
  const group = getCountryGroup('simbabwe')!;
  const en = renderCountryOverview(group, 'en');
  const de = renderCountryOverview(group, 'de');
  assert.match(en, /<h1>Zimbabwe<\/h1>/);
  assert.match(de, /<h1>Simbabwe<\/h1>/);
});
