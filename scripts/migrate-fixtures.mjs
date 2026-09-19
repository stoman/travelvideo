#!/usr/bin/env node
// One-time migration: app/models/{video,trip}.js FIXTURES -> src/data/{videos,trips}.json.
// Not part of the build. Run once with `node scripts/migrate-fixtures.mjs`; see
// spec/data-model.md for the rules this encodes.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function extractFixtures(relativePath) {
  const filePath = path.join(root, relativePath);
  const src = readFileSync(filePath, 'utf8');
  const marker = 'static FIXTURES = ';
  const markerIndex = src.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find "${marker}" in ${relativePath}`);
  }
  const arrayStart = src.indexOf('[', markerIndex);
  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
  if (arrayEnd === -1) {
    throw new Error(`Unterminated FIXTURES array in ${relativePath}`);
  }
  const arraySource = src.slice(arrayStart, arrayEnd + 1);
  // Evaluated, not regex-scraped: correctly handles quoting/escaping/trailing commas
  // the way a real JS parser would, without needing to run the class through the
  // decorator/module pipeline just to read a static array literal off it.
  return new Function(`"use strict"; return (${arraySource});`)();
}

const videoFixtures = extractFixtures('app/models/video.js');
const tripFixtures = extractFixtures('app/models/trip.js');

console.log(
  `Read ${videoFixtures.length} video fixtures, ${tripFixtures.length} trip fixtures.`,
);

// --- Drop the `all` trip, but verify it was consistent with the video list first ---

const allTripFixture = tripFixtures.find((t) => t.id === 'all');
if (!allTripFixture) {
  throw new Error('Expected an "all" trip fixture to verify against');
}

const derivedAllVideos = [...videoFixtures]
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((v) => v.id);

const fixtureAllVideos = allTripFixture.videos;

if (fixtureAllVideos.length !== derivedAllVideos.length) {
  throw new Error(
    `"all" trip has ${fixtureAllVideos.length} videos but there are ${derivedAllVideos.length} video fixtures`,
  );
}
const fixtureAllSet = new Set(fixtureAllVideos);
const derivedAllSet = new Set(derivedAllVideos);
for (const id of derivedAllSet) {
  if (!fixtureAllSet.has(id)) {
    throw new Error(`Video "${id}" is missing from the fixture "all" trip`);
  }
}
for (const id of fixtureAllSet) {
  if (!derivedAllSet.has(id)) {
    throw new Error(`Fixture "all" trip references unknown video "${id}"`);
  }
}
console.log(
  'Derived "all" trip video set matches the fixture "all" trip exactly (order may differ by tie-breaking; set contents identical).',
);

const realTrips = tripFixtures.filter((t) => t.id !== 'all');
console.log(
  `Dropping the "all" trip fixture; writing ${realTrips.length} real trips.`,
);

// --- Field order / shape checks (fail fast on the migration itself, not silently) ---

const videoKeys = [
  'id',
  'name',
  'description',
  'country',
  'filename',
  'date',
  'latitude',
  'longitude',
  'peopleIn',
  'peopleOut',
  'peopleStart',
  'peopleEnd',
  'guests',
  'camera',
  'preferredZoom',
];
const tripKeys = ['id', 'name', 'year', 'videos', 'finished'];

function checkKeys(records, expectedKeys, label) {
  for (const record of records) {
    const actualKeys = Object.keys(record);
    if (
      actualKeys.length !== expectedKeys.length ||
      actualKeys.some((k, i) => k !== expectedKeys[i])
    ) {
      throw new Error(
        `${label} "${record.id}" has unexpected shape: [${actualKeys.join(', ')}], expected [${expectedKeys.join(', ')}]`,
      );
    }
  }
}
checkKeys(videoFixtures, videoKeys, 'video');
checkKeys(realTrips, tripKeys, 'trip');

// --- Write output, preserving field order via the key list above ---

writeFileSync(
  path.join(root, 'src/data/videos.json'),
  JSON.stringify(videoFixtures, null, 2) + '\n',
);
writeFileSync(
  path.join(root, 'src/data/trips.json'),
  JSON.stringify(realTrips, null, 2) + '\n',
);

console.log('Wrote src/data/videos.json and src/data/trips.json.');
