import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderVideoDisplay } from './video-display.ts';
import { getVideo } from '../data/index.ts';

test('renders populated fields, including trip membership links', () => {
  const video = getVideo('hobbiton')!;
  const html = renderVideoDisplay(video, 'en');
  assert.match(html, /<h1>Hobbiton<\/h1>/);
  assert.match(html, /The Lord of the Rings was filmed here\./);
  assert.match(
    html,
    /Country: <a href="\/en\/country\/new-zealand">New Zealand<\/a>/,
  );
  assert.match(html, /Date: 19\.09\.2017/);
  assert.match(html, /Camera: Sony Alpha 6000/);
  assert.match(html, /href="\/en\/trip\/world">Around the World 2017/);
  assert.match(html, /href="\/en\/trip\/start\/world">start full trip/);
  assert.match(html, /href="\/en\/trip\/world\/hobbiton">start at Hobbiton/);
});

test('does not show raw coordinates -- nobody reads those', () => {
  const video = getVideo('hobbiton')!;
  const html = renderVideoDisplay(video, 'en');
  assert.doesNotMatch(html, /Latitude|Longitude/);
});

test('omits empty optional fields entirely', () => {
  const video = getVideo('hobbiton')!;
  assert.equal(video.guests, '');
  const html = renderVideoDisplay(video, 'en');
  assert.doesNotMatch(html, /Guests:/);
});

test('a video with no real trip omits the trips section', () => {
  const video = getVideo('oberschleissheim')!;
  const html = renderVideoDisplay(video, 'en');
  assert.doesNotMatch(html, /part of the trips/);
});

test('German: translated labels, country name, and locale-prefixed hrefs', () => {
  const video = getVideo('hobbiton')!;
  const html = renderVideoDisplay(video, 'de');
  assert.match(
    html,
    /Land: <a href="\/de\/country\/new-zealand">Neuseeland<\/a>/,
  );
  assert.match(html, /Datum: 19\.09\.2017/);
  assert.match(html, /Kamera: Sony Alpha 6000/);
  assert.match(html, /Dieses Video ist Teil folgender Reisen:/);
  assert.match(html, /href="\/de\/trip\/start\/world">ganze Reise starten/);
  assert.match(html, /href="\/de\/trip\/world\/hobbiton">bei Hobbiton starten/);
});
