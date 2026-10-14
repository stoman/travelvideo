import { countrySlug, getTripsForVideo } from '../data/index.ts';
import { getCountryName } from '../data/country-names.ts';
import type { Video } from '../data/types.ts';
import { formatDate } from '../format.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';
import { videoElementHtml } from '../video/player.ts';

/**
 * The metadata block shared by every view that shows a single video --  /:locale/video/:id,
 * /:locale/trip/:tripId/:videoId and /:locale/random/:videoId. These views differ only in which
 * controls/nav make sense around it (full player controls vs. none, trip prev/next, a "stop"
 * link); the video itself and everything said about it stays identical, so it lives here once.
 * Trusted content, except tripId/videoId in hrefs -- those come from Trip/Video ids, simple
 * slugs, not raw input.
 */
export function renderVideoInfo(video: Video, locale: Locale): string {
  const t = translations[locale].videoInfo;
  const trips = getTripsForVideo(video.id);

  const tripItems = trips
    .map(
      (trip) => `
        <li>
          <a href="/${locale}/trip/${trip.id}">${t.tripLine(trip.name, trip.year)}</a>
          (<a href="/${locale}/trip/start/${trip.id}">${t.startFullTrip}</a>,
          <a href="/${locale}/trip/${trip.id}/${video.id}">${t.startAt(video.name)}</a>)
        </li>
      `,
    )
    .join('');

  const tripsSection =
    trips.length > 0 ? `<p>${t.partOfTrips}</p><ul>${tripItems}</ul>` : '';

  return `
    <h1>${video.name}</h1>
    ${video.description ? `<p>${video.description}</p>` : ''}
    <p>${t.country}: <a href="/${locale}/country/${countrySlug(video.country)}">${getCountryName(video.country, locale)}</a></p>
    <p>${t.date}: ${formatDate(video.date)}</p>
    ${video.guests ? `<p>${t.guests}: ${video.guests}</p>` : ''}
    ${video.camera ? `<p>${t.camera}: ${video.camera}</p>` : ''}
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
  locale: Locale,
  options: { controls?: boolean; nav?: string } = {},
): string {
  return `
    <div class="${className}">
      <div class="display-media">
        ${videoElementHtml(video, { controls: options.controls ?? false })}
      </div>
      <div class="display-info">
        ${renderVideoInfo(video, locale)}
        ${options.nav ?? ''}
      </div>
    </div>
  `;
}
