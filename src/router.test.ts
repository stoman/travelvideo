import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute } from './router.ts';

test('/ -> home-redirect', () => {
  assert.deepEqual(parseRoute('/'), { name: 'home-redirect' });
});

test('/about -> about', () => {
  assert.deepEqual(parseRoute('/about'), { name: 'about' });
});

test('/trip -> trips', () => {
  assert.deepEqual(parseRoute('/trip'), { name: 'trips' });
});

test('/trip/:tripId -> trip-overview', () => {
  assert.deepEqual(parseRoute('/trip/china'), { name: 'trip-overview', tripId: 'china' });
});

test('/trip/start/:tripId -> trip-start-redirect (not trip-overview)', () => {
  assert.deepEqual(parseRoute('/trip/start/china'), {
    name: 'trip-start-redirect',
    tripId: 'china',
  });
});

test('/trip/:tripId/:videoId -> trip-display (not trip-overview)', () => {
  assert.deepEqual(parseRoute('/trip/china/peking'), {
    name: 'trip-display',
    tripId: 'china',
    videoId: 'peking',
  });
});

test('a trip literally named "start" is unambiguous by segment count alone', () => {
  // No real trip is named "start", but the matcher must not rely on that: 2 segments is always
  // trip-overview, 3 with a literal "start" second segment is always the redirect.
  assert.deepEqual(parseRoute('/trip/start'), { name: 'trip-overview', tripId: 'start' });
});

test('/video -> videos', () => {
  assert.deepEqual(parseRoute('/video'), { name: 'videos' });
});

test('/video/:videoId -> video-display', () => {
  assert.deepEqual(parseRoute('/video/hobbiton'), { name: 'video-display', videoId: 'hobbiton' });
});

test('/map -> map', () => {
  assert.deepEqual(parseRoute('/map'), { name: 'map' });
});

test('/random -> random-redirect', () => {
  assert.deepEqual(parseRoute('/random'), { name: 'random-redirect' });
});

test('/random/:videoId -> random-display', () => {
  assert.deepEqual(parseRoute('/random/hobbiton'), {
    name: 'random-display',
    videoId: 'hobbiton',
  });
});

test('unknown paths resolve to not-found', () => {
  assert.deepEqual(parseRoute('/nope'), { name: 'not-found' });
  assert.deepEqual(parseRoute('/trip/a/b/c'), { name: 'not-found' });
  assert.deepEqual(parseRoute('/video/a/b'), { name: 'not-found' });
  assert.deepEqual(parseRoute('/random/a/b'), { name: 'not-found' });
  assert.deepEqual(parseRoute('/about/extra'), { name: 'not-found' });
});

test('trailing slashes and double slashes are tolerated', () => {
  assert.deepEqual(parseRoute('/trip/'), { name: 'trips' });
  assert.deepEqual(parseRoute('/trip/china/'), { name: 'trip-overview', tripId: 'china' });
  assert.deepEqual(parseRoute('//trip//china//'), { name: 'trip-overview', tripId: 'china' });
});
