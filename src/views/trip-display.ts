import type { Trip, Video } from '../data/types.ts';
import { renderVideoDisplayShell } from './video-info.ts';

/**
 * /trip/:tripId/:videoId: playback within a trip, lean-back and chained (no controls, per
 * video.md). Offers explicit previous/next links and a "stop at this video" escape to
 * /video/:videoId. Chaining itself (advancing on `ended`) is wired in main.ts, since it needs
 * DOM access to the rendered <video> element. See video-info.ts for the shared metadata block.
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

  // No link back to the trip here -- the "This video is part of the trips" list from
  // video-info.ts already links to it (and, unlike a plain link, offers "start full trip"/
  // "start at this video" too), so a second plain link would just duplicate it.
  const nav = `
    <nav>
      ${prevLink}
      ${nextLink}
      <a href="/video/${video.id}">Stop at this video</a>
    </nav>
  `;

  return renderVideoDisplayShell('trip-display', video, { nav });
}
