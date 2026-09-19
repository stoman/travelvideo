import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderRandomDisplay } from './random-display.ts';
import { getVideo } from '../data/index.ts';

test('renders the video without controls', () => {
  const video = getVideo('hobbiton')!;
  const html = renderRandomDisplay(video);
  assert.match(html, /<h1>Hobbiton<\/h1>/);
  assert.match(html, /<video[^>]*src="\/assets\/videos\/hobbiton\.mp4"/);
  assert.doesNotMatch(html, /<video[^>]* controls/);
});

test('shows the same metadata as /video/:id, per video-info.ts', () => {
  const video = getVideo('hobbiton')!;
  const html = renderRandomDisplay(video);
  assert.match(
    html,
    /Country: <a href="\/country\/new-zealand">New Zealand<\/a>/,
  );
  assert.match(html, /Date: 19\.09\.2017/);
  assert.match(html, /href="\/trip\/world">Around the World 2017/);
});

test("offers a way off the shuffle onto the video's own page, no other nav", () => {
  const video = getVideo('hobbiton')!;
  const html = renderRandomDisplay(video);
  assert.match(html, /href="\/video\/hobbiton">Stop at this video/);
  assert.doesNotMatch(html, /Previous video|Next video/);
});
