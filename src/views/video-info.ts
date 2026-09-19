import { countrySlug, getTripsForVideo } from '../data/index.ts';
import type { Video } from '../data/types.ts';
import { formatDate } from '../format.ts';
import { videoElementHtml } from '../video/player.ts';

/**
 * The metadata block shared by every view that shows a single video --  /video/:id,
 * /trip/:tripId/:videoId and /random/:videoId. These views differ only in which controls/nav
 * make sense around it (full player controls vs. none, trip prev/next, a "stop" link); the video
 * itself and everything said about it stays identical, so it lives here once. Trusted content,
 * except tripId/videoId in hrefs -- those come from Trip/Video ids, simple slugs, not raw input.
 */
export function renderVideoInfo(video: Video): string {
  const trips = getTripsForVideo(video.id);

  const tripItems = trips
    .map(
      (trip) => `
        <li>
          <a href="/trip/${trip.id}">${trip.name} ${trip.year}</a>
          (<a href="/trip/start/${trip.id}">start full trip</a>,
          <a href="/trip/${trip.id}/${video.id}">start at ${video.name}</a>)
        </li>
      `,
    )
    .join('');

  const tripsSection =
    trips.length > 0
      ? `<p>This video is part of the trips:</p><ul>${tripItems}</ul>`
      : '';

  return `
    <h1>${video.name}</h1>
    ${video.description ? `<p>${video.description}</p>` : ''}
    <p>Country: <a href="/country/${countrySlug(video.country)}">${video.country}</a></p>
    <p>Date: ${formatDate(video.date)}</p>
    ${video.guests ? `<p>Guests: ${video.guests}</p>` : ''}
    ${video.camera ? `<p>Camera: ${video.camera}</p>` : ''}
    ${tripsSection}
  `;
}

/**
 * The shell every single-video view renders: media on one side, `renderVideoInfo` plus the
 * view's own nav (prev/next, stop-at, or nothing) on the other. `className` picks the view's own
 * CSS hook (`.video-display` etc.) so per-route styling still works, even though the markup
 * shape is now identical.
 */
export function renderVideoDisplayShell(
  className: string,
  video: Video,
  options: { controls?: boolean; nav?: string } = {},
): string {
  return `
    <div class="${className}">
      <div class="display-media">
        ${videoElementHtml(video, { controls: options.controls ?? false })}
      </div>
      <div class="display-info">
        ${renderVideoInfo(video)}
        ${options.nav ?? ''}
      </div>
    </div>
  `;
}
