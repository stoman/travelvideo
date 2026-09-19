import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderVideoDisplay } from './video-display.ts';
import { getVideo } from '../data/index.ts';

test('renders populated fields, including trip membership links', () => {
  const video = getVideo('hobbiton')!;
  const html = renderVideoDisplay(video);
  assert.match(html, /<h1>Hobbiton<\/h1>/);
  assert.match(html, /The Lord of the Rings was filmed here\./);
  assert.match(
    html,
    /Country: <a href="\/country\/new-zealand">New Zealand<\/a>/,
  );
  assert.match(html, /Date: 19\.09\.2017/);
  assert.match(html, /Camera: Sony Alpha 6000/);
  assert.match(html, /href="\/trip\/world">Around the World 2017/);
  assert.match(html, /href="\/trip\/start\/world">start full trip/);
  assert.match(html, /href="\/trip\/world\/hobbiton">start at Hobbiton/);
});

test('does not show raw coordinates -- nobody reads those', () => {
  const video = getVideo('hobbiton')!;
  const html = renderVideoDisplay(video);
  assert.doesNotMatch(html, /Latitude|Longitude/);
});

test('omits empty optional fields entirely', () => {
  const video = getVideo('hobbiton')!;
  assert.equal(video.guests, '');
  const html = renderVideoDisplay(video);
  assert.doesNotMatch(html, /Guests:/);
});

test('a video with no real trip omits the trips section', () => {
  const video = getVideo('oberschleissheim')!;
  const html = renderVideoDisplay(video);
  assert.doesNotMatch(html, /part of the trips/);
});
