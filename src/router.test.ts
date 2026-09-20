import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, switchLocalePath } from './router.ts';

test('/ -> locale-redirect (no locale known yet)', () => {
  assert.deepEqual(parseRoute('/'), { name: 'locale-redirect', path: '/' });
});

test('unprefixed legacy paths -> locale-redirect, preserving the original path', () => {
  assert.deepEqual(parseRoute('/trip'), {
    name: 'locale-redirect',
    path: '/trip',
  });
  assert.deepEqual(parseRoute('/trip/china'), {
    name: 'locale-redirect',
    path: '/trip/china',
  });
});

test('an unsupported locale-like prefix is treated as unprefixed', () => {
  assert.deepEqual(parseRoute('/fr/trip'), {
    name: 'locale-redirect',
    path: '/fr/trip',
  });
});

test('/:locale alone -> home-redirect with the locale already known', () => {
  assert.deepEqual(parseRoute('/en'), {
    name: 'home-redirect',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/de'), {
    name: 'home-redirect',
    locale: 'de',
  });
});

test('/:locale/about -> about', () => {
  assert.deepEqual(parseRoute('/en/about'), { name: 'about', locale: 'en' });
});

test('/:locale/trip -> trips', () => {
  assert.deepEqual(parseRoute('/en/trip'), { name: 'trips', locale: 'en' });
});

test('/:locale/trip/:tripId -> trip-overview', () => {
  assert.deepEqual(parseRoute('/en/trip/china'), {
    name: 'trip-overview',
    locale: 'en',
    tripId: 'china',
  });
});

test('/:locale/trip/start/:tripId -> trip-start-redirect (not trip-overview)', () => {
  assert.deepEqual(parseRoute('/en/trip/start/china'), {
    name: 'trip-start-redirect',
    locale: 'en',
    tripId: 'china',
  });
});

test('/:locale/trip/:tripId/:videoId -> trip-display (not trip-overview)', () => {
  assert.deepEqual(parseRoute('/en/trip/china/peking'), {
    name: 'trip-display',
    locale: 'en',
    tripId: 'china',
    videoId: 'peking',
  });
});

test('a trip literally named "start" is unambiguous by segment count alone', () => {
  // No real trip is named "start", but the matcher must not rely on that: 2 segments after the
  // locale is always trip-overview, 3 with a literal "start" second segment is always the
  // redirect.
  assert.deepEqual(parseRoute('/en/trip/start'), {
    name: 'trip-overview',
    locale: 'en',
    tripId: 'start',
  });
});

test('/:locale/video -> videos', () => {
  assert.deepEqual(parseRoute('/en/video'), { name: 'videos', locale: 'en' });
});

test('/:locale/video/:videoId -> video-display', () => {
  assert.deepEqual(parseRoute('/en/video/hobbiton'), {
    name: 'video-display',
    locale: 'en',
    videoId: 'hobbiton',
  });
});

test('/:locale/map -> map', () => {
  assert.deepEqual(parseRoute('/en/map'), { name: 'map', locale: 'en' });
});

test('/:locale/country/:slug -> country-overview', () => {
  assert.deepEqual(parseRoute('/en/country/new-zealand'), {
    name: 'country-overview',
    locale: 'en',
    slug: 'new-zealand',
  });
});

test('/:locale/random -> random-redirect', () => {
  assert.deepEqual(parseRoute('/en/random'), {
    name: 'random-redirect',
    locale: 'en',
  });
});

test('/:locale/random/:videoId -> random-display', () => {
  assert.deepEqual(parseRoute('/en/random/hobbiton'), {
    name: 'random-display',
    locale: 'en',
    videoId: 'hobbiton',
  });
});

test('unknown paths under a valid locale resolve to not-found', () => {
  assert.deepEqual(parseRoute('/en/nope'), { name: 'not-found', locale: 'en' });
  assert.deepEqual(parseRoute('/en/trip/a/b/c'), {
    name: 'not-found',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/en/video/a/b'), {
    name: 'not-found',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/en/random/a/b'), {
    name: 'not-found',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/en/about/extra'), {
    name: 'not-found',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/en/country'), {
    name: 'not-found',
    locale: 'en',
  });
  assert.deepEqual(parseRoute('/en/country/a/b'), {
    name: 'not-found',
    locale: 'en',
  });
});

test('trailing slashes and double slashes are tolerated', () => {
  assert.deepEqual(parseRoute('/en/trip/'), { name: 'trips', locale: 'en' });
  assert.deepEqual(parseRoute('/en/trip/china/'), {
    name: 'trip-overview',
    locale: 'en',
    tripId: 'china',
  });
  assert.deepEqual(parseRoute('//en//trip//china//'), {
    name: 'trip-overview',
    locale: 'en',
    tripId: 'china',
  });
});

test('switchLocalePath swaps the leading locale segment, keeping the rest', () => {
  assert.equal(switchLocalePath('/en/trip/china', 'de'), '/de/trip/china');
  assert.equal(
    switchLocalePath('/de/video/hobbiton', 'en'),
    '/en/video/hobbiton',
  );
  assert.equal(switchLocalePath('/en', 'de'), '/de');
});

test('switchLocalePath on a path with no locale segment just prepends one', () => {
  assert.equal(switchLocalePath('/trip/china', 'de'), '/de/trip/china');
});
