import { getVideo, dayGapsForTrip } from '../data/index.ts';
import type { Trip } from '../data/types.ts';
import { formatDate } from '../format.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/**
 * /:locale/trip/:tripId: itinerary with day gaps. Trusted content, except tripId/videoId in
 * hrefs -- those come from Trip/Video ids, which are simple slugs, not raw URL input.
 *
 * The route map fitted to this trip's bounds is added in Phase 5; this view covers everything
 * else.
 */
export function renderTripOverview(trip: Trip, locale: Locale): string {
  const t = translations[locale];
  const gaps = dayGapsForTrip(trip);

  const items = trip.videos
    .map((id, i) => {
      const video = getVideo(id)!;
      const gap = i > 0 ? gaps[i - 1]! : 0;
      const gapItem =
        gap > 0 ? `<li class="day-gap">${t.tripOverview.dayGap(gap)}</li>` : '';
      return `${gapItem}<li><a href="/${locale}/trip/${trip.id}/${id}">${video.name}</a> — ${formatDate(video.date)}</li>`;
    })
    .join('');

  // The main call to action on this page -- styled as a big stamp (see layout.css) rather than
  // a plain text link, and placed above the itinerary rather than below it, so it isn't missed
  // by someone who doesn't scroll all the way down a long trip.
  const firstVideoId = trip.videos[0];
  const cta = firstVideoId
    ? `<p class="cta"><a class="cta-stamp" href="/${locale}/trip/${trip.id}/${firstVideoId}">${t.tripOverview.watchAll}</a></p>`
    : '';

  // Short trips read fine as a single list; columns only earn their keep once there's enough
  // itinerary to actually cause scrolling. Below that, splitting into columns just makes a short
  // page harder to scan top-to-bottom for no space saved.
  const SINGLE_COLUMN_THRESHOLD = 10;
  const listClass =
    trip.videos.length > SINGLE_COLUMN_THRESHOLD
      ? 'itinerary itinerary--columns'
      : 'itinerary';

  return `
    <div class="trip-overview">
      <h1>${trip.name}</h1>
      <p>${trip.year}</p>
      ${cta}
      <ul class="${listClass}">${items}</ul>
    </div>
  `;
}
