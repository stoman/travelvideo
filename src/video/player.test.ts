import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextVideoIdInTrip, pickChainedVideo, pickRandomVideo } from './player.ts';
import { getTrip, videos, getVideo } from '../data/index.ts';
import type { Video } from '../data/types.ts';

test('nextVideoIdInTrip walks the trip order and returns null past the end', () => {
  const trip = getTrip('sicily')!; // ['taormina', 'siracusa', 'etna']
  assert.equal(nextVideoIdInTrip(trip, 'taormina'), 'siracusa');
  assert.equal(nextVideoIdInTrip(trip, 'siracusa'), 'etna');
  assert.equal(nextVideoIdInTrip(trip, 'etna'), null);
});

test('nextVideoIdInTrip returns null for a video not in the trip', () => {
  const trip = getTrip('sicily')!;
  assert.equal(nextVideoIdInTrip(trip, 'hobbiton'), null);
});

test('pickRandomVideo always returns a member of the list', () => {
  const pool: Video[] = [getVideo('hobbiton')!, getVideo('abisko')!];
  for (let i = 0; i < 20; i++) {
    const picked = pickRandomVideo(pool);
    assert.ok(pool.includes(picked));
  }
});

test('pickRandomVideo throws on an empty list rather than returning undefined', () => {
  assert.throws(() => pickRandomVideo([]));
});

test('pickChainedVideo only returns videos whose peopleStart matches the current peopleEnd, when matches exist', () => {
  const current = getVideo('hobbiton')!; // peopleEnd: 'Anna'
  const candidates = videos.filter((v) => v.peopleStart === current.peopleEnd);
  assert.ok(candidates.length > 0, 'test assumes at least one real match exists in the data');
  for (let i = 0; i < 20; i++) {
    const picked = pickChainedVideo(current, videos);
    assert.equal(picked.peopleStart, current.peopleEnd);
  }
});

test('pickChainedVideo falls back to any video when nothing matches', () => {
  const noMatchTarget: Video = { ...getVideo('hobbiton')!, peopleEnd: 'Nobody Ever Named This' };
  const picked = pickChainedVideo(noMatchTarget, videos);
  assert.ok(videos.includes(picked));
});
