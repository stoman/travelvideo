import type { Video } from '../data/types.ts';
import { videoElementHtml } from '../video/player.ts';

/**
 * /random/:videoId: playback chained by people matching, no controls. Chaining itself
 * (advancing on `ended` to the precomputed next video) is wired in main.ts.
 */
export function renderRandomDisplay(video: Video): string {
  return `
    <div class="random-display">
      ${videoElementHtml(video)}
      <h1>${video.name}</h1>
    </div>
  `;
}
