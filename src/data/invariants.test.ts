import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { videos, realTrips, getVideo, dayGap } from './index.ts';

const videosDir = path.join(
  path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url)))),
  'public/assets/videos',
);

// Real, pre-existing exceptions to the people-chain rule -- confirmed, not to be "fixed".
// See spec/data-model.md.
const KNOWN_PEOPLE_CHAIN_BREAKS = new Set([
  'china:peking->peking_olympic_park',
  'china:tiantouzhai->tiantouzhai2',
  'china:tiantouzhai2->yangshuo',
  'world:miami_beach->miami',
  'world:miami->quito',
]);

// Found by this test suite, not documented in spec/data-model.md -- genuinely new, unreviewed
// data issues in the pre-existing fixtures (not something this migration introduced; confirmed
// against app/models/trip.js directly). Reported as warnings, same treatment as the people-chain
// breaks above, until Stefan confirms whether each is intentional or a fix is needed.
const KNOWN_UNREFERENCED_VIDEOS = new Set([
  'oberschleissheim',
  'weissenfels',
  'koenigssee',
  'timisoara',
]);
const KNOWN_DATE_ORDER_BREAKS = new Set([
  'oscars:kings_canyon->purisima_creek',
]);

test('video ids are unique', () => {
  const ids = videos.map((v) => v.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('trip ids are unique', () => {
  const ids = realTrips.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every video id referenced by a trip exists', () => {
  for (const trip of realTrips) {
    for (const videoId of trip.videos) {
      assert.ok(
        getVideo(videoId),
        `trip "${trip.id}" references unknown video "${videoId}"`,
      );
    }
  }
});

test('every video is referenced by at least one real trip', () => {
  const referenced = new Set(realTrips.flatMap((t) => t.videos));
  const unexpected: string[] = [];
  const knownSeen = new Set<string>();

  for (const video of videos) {
    if (referenced.has(video.id)) continue;
    if (KNOWN_UNREFERENCED_VIDEOS.has(video.id)) {
      knownSeen.add(video.id);
    } else {
      unexpected.push(video.id);
    }
  }

  if (knownSeen.size > 0) {
    console.warn(
      `${knownSeen.size} known unreferenced video(s), reported as a warning pending review: ${[...knownSeen].join(', ')}`,
    );
  }
  assert.deepEqual(
    unexpected,
    [],
    `unexpected unreferenced video(s): ${unexpected.join(', ')}`,
  );
  assert.equal(
    knownSeen.size,
    KNOWN_UNREFERENCED_VIDEOS.size,
    'a previously-known unreferenced video is now referenced -- update KNOWN_UNREFERENCED_VIDEOS',
  );
});

test('coordinates are within valid, non-placeholder ranges', () => {
  for (const video of videos) {
    assert.ok(
      video.latitude >= -90 && video.latitude <= 90,
      `video "${video.id}" has invalid latitude ${video.latitude}`,
    );
    assert.ok(
      video.longitude >= -180 && video.longitude <= 180,
      `video "${video.id}" has invalid longitude ${video.longitude}`,
    );
    assert.ok(
      video.latitude !== 0 || video.longitude !== 0,
      `video "${video.id}" has placeholder coordinates 0,0`,
    );
  }
});

test('preferredZoom is an integer within the map zoom range', () => {
  // Zoom limits from spec/map.md: min 2, max 12.
  for (const video of videos) {
    assert.ok(
      Number.isInteger(video.preferredZoom),
      `video "${video.id}" has non-integer preferredZoom ${video.preferredZoom}`,
    );
    assert.ok(
      video.preferredZoom >= 2 && video.preferredZoom <= 12,
      `video "${video.id}" has preferredZoom ${video.preferredZoom} outside [2, 12]`,
    );
  }
});

test('dates parse as valid ISO dates', () => {
  for (const video of videos) {
    assert.match(
      video.date,
      /^\d{4}-\d{2}-\d{2}$/,
      `video "${video.id}" has non-ISO date`,
    );
    assert.ok(
      !Number.isNaN(Date.parse(video.date)),
      `video "${video.id}" date does not parse`,
    );
  }
});

test('dates are non-decreasing within each trip', () => {
  const unexpected: string[] = [];
  const knownSeen = new Set<string>();

  for (const trip of realTrips) {
    for (let i = 1; i < trip.videos.length; i++) {
      const prev = getVideo(trip.videos[i - 1]!)!;
      const curr = getVideo(trip.videos[i]!)!;
      if (prev.date <= curr.date) continue;
      const key = `${trip.id}:${prev.id}->${curr.id}`;
      const detail = `${key}: ${prev.date} then ${curr.date}`;
      if (KNOWN_DATE_ORDER_BREAKS.has(key)) {
        knownSeen.add(key);
      } else {
        unexpected.push(detail);
      }
    }
  }

  if (knownSeen.size > 0) {
    console.warn(
      `${knownSeen.size} known date-order break(s), reported as a warning pending review: ${[...knownSeen].join(', ')}`,
    );
  }
  assert.deepEqual(
    unexpected,
    [],
    `unexpected date-order break(s): ${unexpected.join('; ')}`,
  );
  assert.equal(
    knownSeen.size,
    KNOWN_DATE_ORDER_BREAKS.size,
    'a previously-known date-order break is now in order -- update KNOWN_DATE_ORDER_BREAKS',
  );
});

test('filenames are non-empty and unique', () => {
  const filenames = videos.map((v) => v.filename);
  assert.ok(filenames.every((f) => f.length > 0));
  assert.equal(new Set(filenames).size, filenames.length);
});

test('every filename resolves to a file in public/assets/videos', () => {
  for (const video of videos) {
    assert.ok(
      existsSync(path.join(videosDir, video.filename)),
      `video "${video.id}" references missing file "${video.filename}"`,
    );
  }
});

test("people chain: peopleEnd matches the next video's peopleStart (known breaks reported, not failed)", () => {
  const unexpectedBreaks: string[] = [];
  const knownBreaksSeen = new Set<string>();

  for (const trip of realTrips) {
    for (let i = 1; i < trip.videos.length; i++) {
      const prev = getVideo(trip.videos[i - 1]!)!;
      const curr = getVideo(trip.videos[i]!)!;
      if (prev.peopleEnd !== curr.peopleStart) {
        const key = `${trip.id}:${prev.id}->${curr.id}`;
        if (KNOWN_PEOPLE_CHAIN_BREAKS.has(key)) {
          knownBreaksSeen.add(key);
        } else {
          unexpectedBreaks.push(
            `${key}: "${prev.peopleEnd}" -> "${curr.peopleStart}"`,
          );
        }
      }
    }
  }

  if (knownBreaksSeen.size > 0) {
    console.warn(
      `${knownBreaksSeen.size} known people-chain break(s), reported as warnings per spec/data-model.md (may be intentional -- a travel day or change of companions):`,
    );
    for (const key of knownBreaksSeen) console.warn(`  ${key}`);
  }
  if (unexpectedBreaks.length > 0) {
    console.warn(
      'Unexpected people-chain breaks (review before promoting this check to a hard failure):',
    );
    for (const line of unexpectedBreaks) console.warn(`  ${line}`);
  }
  assert.equal(
    unexpectedBreaks.length,
    0,
    `${unexpectedBreaks.length} unexpected people-chain break(s); see warnings above`,
  );
  assert.equal(
    knownBreaksSeen.size,
    KNOWN_PEOPLE_CHAIN_BREAKS.size,
    'a previously-known people-chain break is missing -- data may have changed; update the known-breaks list',
  );
});

test('dayGap: off-by-one and non-positive-renders-nothing behaviour', () => {
  assert.equal(dayGap('2013-08-15', '2013-08-16'), 0); // consecutive days, no gap
  assert.equal(dayGap('2013-08-15', '2013-08-15'), -1); // same day, negative
  assert.equal(dayGap('2013-08-15', '2013-08-18'), 2); // two full days without video
});
