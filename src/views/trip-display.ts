import type { Trip, Video } from '../data/types.ts';
import { videoElementHtml } from '../video/player.ts';

/**
 * /trip/:tripId/:videoId: playback within a trip, lean-back and chained (no controls, per
 * video.md). Offers explicit previous/next links and a "stop at this video" escape to
 * /video/:videoId. Chaining itself (advancing on `ended`) is wired in main.ts, since it needs
 * DOM access to the rendered <video> element.
 */
export function renderTripDisplay(trip: Trip, video: Video): string {
  const index = trip.videos.indexOf(video.id);
  const prevId = index > 0 ? trip.videos[index - 1] : undefined;
  const nextId =
    index >= 0 && index < trip.videos.length - 1
      ? trip.videos[index + 1]
      : undefined;

  const prevLink = prevId
    ? `<a href="/trip/${trip.id}/${prevId}">Previous video</a>`
    : '';
  const nextLink = nextId
    ? `<a href="/trip/${trip.id}/${nextId}">Next video</a>`
    : '';

  return `
    <div class="trip-display">
      ${videoElementHtml(video)}
      <h1>${video.name}</h1>
      <p><a href="/trip/${trip.id}">${trip.name}</a></p>
      <nav>
        ${prevLink}
        ${nextLink}
        <a href="/video/${video.id}">Stop at this video</a>
      </nav>
    </div>
  `;
}
