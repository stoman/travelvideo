import type { Video } from '../data/types.ts';
import { renderVideoDisplayShell } from './video-info.ts';

/**
 * /random/:videoId: playback chained by people matching, no controls. Chaining itself
 * (advancing on `ended` to the precomputed next video) is wired in main.ts. The only nav that
 * makes sense here is a way off the random shuffle onto the video's own page -- there's no
 * prev/trip context to link back to. See video-info.ts for the shared metadata block.
 */
export function renderRandomDisplay(video: Video): string {
  const nav = `<nav><a href="/video/${video.id}">Stop at this video</a></nav>`;
  return renderVideoDisplayShell('random-display', video, { nav });
}
