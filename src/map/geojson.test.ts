import { test } from 'node:test';
import assert from 'node:assert/strict';
import { videosGeoJSON, tripRoutesGeoJSON, HOME } from './geojson.ts';
import { videos, trips, getTrip } from '../data/index.ts';

test('videosGeoJSON: one point feature per video with matching coordinates and id', () => {
  const fc = videosGeoJSON(videos);
  assert.equal(fc.features.length, videos.length);
  const hobbiton = fc.features.find((f) => f.properties.id === 'hobbiton')!;
  assert.deepEqual(hobbiton.geometry.coordinates, [175.679911, -37.857712]);
});

test('tripRoutesGeoJSON: excludes the derived all trip', () => {
  const fc = tripRoutesGeoJSON(trips);
  assert.equal(fc.features.some((f) => f.properties.id === 'all'), false);
  assert.equal(fc.features.length, trips.length - 1);
});

test('tripRoutesGeoJSON: every route starts at home', () => {
  const fc = tripRoutesGeoJSON(trips);
  for (const feature of fc.features) {
    assert.deepEqual(feature.geometry.coordinates[0], HOME);
  }
});

test('tripRoutesGeoJSON: a finished trip loops back to home', () => {
  const finished = getTrip('sicily')!;
  assert.equal(finished.finished, true);
  const fc = tripRoutesGeoJSON(trips);
  const feature = fc.features.find((f) => f.properties.id === 'sicily')!;
  assert.deepEqual(feature.geometry.coordinates.at(-1), HOME);
});

test('tripRoutesGeoJSON: an unfinished trip does not loop back to home', () => {
  // No real trip is currently unfinished, so construct one to exercise this path directly
  // rather than depending on the data staying that way.
  const unfinishedTrip = { id: 'synthetic', name: 'Synthetic', year: '2099', videos: ['hobbiton'], finished: false };
  const fc = tripRoutesGeoJSON([unfinishedTrip]);
  const feature = fc.features[0]!;
  assert.notDeepEqual(feature.geometry.coordinates.at(-1), HOME);
  assert.equal(feature.geometry.coordinates.length, 2); // home + the one video, no loop back
});

test('tripRoutesGeoJSON: route length matches home + video count (+1 if looped)', () => {
  const trip = getTrip('sicily')!; // 3 videos, finished
  const fc = tripRoutesGeoJSON(trips);
  const feature = fc.features.find((f) => f.properties.id === 'sicily')!;
  assert.equal(feature.geometry.coordinates.length, 1 + trip.videos.length + 1);
});
