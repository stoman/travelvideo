import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTripOverview } from './trip-overview.ts';
import { getTrip } from '../data/index.ts';

test('lists videos in itinerary order with links and dates', () => {
  const trip = getTrip('sicily')!;
  const html = renderTripOverview(trip);
  assert.match(html, /<h1>Sicily<\/h1>/);
  assert.match(html, /<p>2015<\/p>/);
  const taorminaIndex = html.indexOf('Taormina');
  const siracusaIndex = html.indexOf('Siracusa', taorminaIndex);
  const etnaIndex = html.indexOf('Etna', siracusaIndex);
  assert.ok(
    taorminaIndex >= 0 &&
      siracusaIndex > taorminaIndex &&
      etnaIndex > siracusaIndex,
  );
  assert.match(html, /href="\/trip\/sicily\/taormina"/);
});

test('a positive day gap renders, in the right place', () => {
  // sicily: taormina (2015-xx-xx) -> siracusa has a 3-day gap; siracusa -> etna does not.
  const trip = getTrip('sicily')!;
  const html = renderTripOverview(trip);
  assert.match(html, /3 days without video/);
  const gapIndex = html.indexOf('3 days without video');
  const taorminaIndex = html.indexOf('Taormina');
  const siracusaIndex = html.indexOf('Siracusa');
  assert.ok(
    gapIndex > taorminaIndex && gapIndex < siracusaIndex,
    'gap should sit between the two videos it separates',
  );
});

test('zero or negative gaps render nothing', () => {
  const trip = getTrip('interrail')!;
  const html = renderTripOverview(trip);
  // munich_airport -> stockholm_arlanda is a same/next-day hop, no gap text for it
  assert.doesNotMatch(html, /0 days without video/);
});

test('the call to action links to the first video', () => {
  const trip = getTrip('sicily')!;
  const html = renderTripOverview(trip);
  assert.match(html, /Watch all the videos of this trip/);
  assert.match(
    html,
    /href="\/trip\/sicily\/taormina">Watch all the videos of this trip/,
  );
});
