import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderVideos } from './videos.ts';
import { videosByCountry, counts, getVideo } from '../data/index.ts';
import { formatDate } from '../format.ts';

test('heading shows the real counts', () => {
  const html = renderVideos(videosByCountry, counts);
  assert.match(
    html,
    new RegExp(`${counts.videos} Videos from ${counts.countries} Countries`),
  );
});

test('every video appears under its country with a link and date', () => {
  const html = renderVideos(videosByCountry, counts);
  const hobbiton = getVideo('hobbiton')!;
  assert.match(
    html,
    /<h2><a class="[^"]*" href="\/country\/new-zealand">New Zealand<\/a><\/h2>/,
  );
  assert.match(html, /href="\/video\/hobbiton"/);
  assert.match(
    html,
    new RegExp(`Hobbiton<\\/a> — ${formatDate(hobbiton.date)}`),
  );
});

test('videos within a country are sorted by name', () => {
  const germany = videosByCountry.find((g) => g.country === 'Germany')!;
  const names = germany.videos.map((v) => v.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(names, sorted);
});
