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
