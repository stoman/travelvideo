import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTrips } from './trips.ts';
import { trips, getTrip } from '../data/index.ts';

test('every trip appears with a link and its video names, in order', () => {
  const html = renderTrips(trips);
  const china = getTrip('china')!;
  assert.match(html, /href="\/trip\/china"/);
  assert.match(html, />China<\/a>/);
  assert.match(html, /\(2014\)/);
  // videos in itinerary order, not alphabetical
  const dubaiIndex = html.indexOf('Dubai');
  const pekingIndex = html.indexOf('Peking', dubaiIndex);
  assert.ok(
    dubaiIndex >= 0 && pekingIndex > dubaiIndex,
    'video names should appear in trip order',
  );
  assert.equal(china.videos.length, 13);
});

test('the derived all trip is included and rendered', () => {
  const html = renderTrips(trips);
  assert.match(html, /href="\/trip\/all"/);
});
