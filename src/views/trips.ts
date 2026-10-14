import { getVideo } from '../data/index.ts';
import type { Trip } from '../data/types.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/** /:locale/trip: list of trips -- name, year, and the video names within each. Trusted content. */
export function renderTrips(trips: Trip[], locale: Locale): string {
  const t = translations[locale];
  const items = trips
    .map((trip) => {
      const videoNames = trip.videos
        .map((id) => getVideo(id)?.name ?? id)
        .join(', ');
      // Same "watch" call to action as the trip's own page (trip-overview.ts), scaled down and
      // floated right -- one stamp per row here rather than the single big one there.
      const firstVideoId = trip.videos[0];
      const watchButton = firstVideoId
        ? `<a class="cta-stamp cta-stamp--small" href="/${locale}/trip/${trip.id}/${firstVideoId}">${t.trips.watchTrip(trip.name)}</a>`
        : '';
      return `
        <li>
          ${watchButton}
          <a href="/${locale}/trip/${trip.id}">${trip.name}</a> (${trip.year})
          <p>${videoNames}</p>
        </li>
      `;
    })
    .join('');

  return `
    <div class="trips">
      <h1>${t.trips.heading}</h1>
      <ul>${items}</ul>
    </div>
  `;
}
