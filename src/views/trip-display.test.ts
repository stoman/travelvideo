import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTripDisplay } from './trip-display.ts';
import { getTrip, getVideo } from '../data/index.ts';

test('middle video gets both previous and next links, plus stop-at', () => {
  const trip = getTrip('sicily')!; // ['taormina', 'siracusa', 'etna']
  const video = getVideo('siracusa')!;
  const html = renderTripDisplay(trip, video);
  assert.match(html, /href="\/trip\/sicily\/taormina">Previous video/);
  assert.match(html, /href="\/trip\/sicily\/etna">Next video/);
  assert.match(html, /href="\/video\/siracusa">Stop at this video/);
  assert.match(html, /<video[^>]*src="\/assets\/videos\/siracusa\.mp4"/);
  assert.doesNotMatch(html, /<video[^>]* controls/);
});

test('shows the same metadata as /video/:id, per video-info.ts', () => {
  const trip = getTrip('sicily')!;
  const video = getVideo('siracusa')!;
  const html = renderTripDisplay(trip, video);
  assert.match(html, /Country: <a href="\/country\/italy">Italy<\/a>/);
  assert.match(html, /Date: 30\.07\.2015/);
});

test('first video has no previous link', () => {
  const trip = getTrip('sicily')!;
  const video = getVideo('taormina')!;
  const html = renderTripDisplay(trip, video);
  assert.doesNotMatch(html, /Previous video/);
  assert.match(html, /Next video/);
});

test('last video has no next link', () => {
  const trip = getTrip('sicily')!;
  const video = getVideo('etna')!;
  const html = renderTripDisplay(trip, video);
  assert.match(html, /Previous video/);
  assert.doesNotMatch(html, /Next video/);
});
