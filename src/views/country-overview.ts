import type { CountryGroup } from '../data/index.ts';
import { getCountryName } from '../data/country-names.ts';
import { formatDate } from '../format.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/**
 * /:locale/country/:slug: every video filmed in this country, individually linked. Looks like
 * /:locale/trip/:tripId (trip-overview.ts) -- same box, same list styling -- but with no "watch
 * all" call to action: a country grouping has no itinerary order to chain playback through,
 * unlike a trip, so linking straight to each video (as /:locale/video already does) is the
 * honest choice here.
 */
export function renderCountryOverview(
  group: CountryGroup,
  locale: Locale,
): string {
  const t = translations[locale];
  const items = group.videos
    .map(
      (v) =>
        `<li><a href="/${locale}/video/${v.id}">${v.name}</a> — ${formatDate(v.date)}</li>`,
    )
    .join('');

  // Same single-vs-multi-column threshold as trip-overview.ts, for the same reason: short lists
  // read fine as one column, columns only earn their keep past that.
  const SINGLE_COLUMN_THRESHOLD = 10;
  const listClass =
    group.videos.length > SINGLE_COLUMN_THRESHOLD
      ? 'itinerary itinerary--columns'
      : 'itinerary';

  return `
    <div class="country-overview">
      <h1>${getCountryName(group.country, locale)}</h1>
      <p>${t.countryOverview.videoCount(group.videos.length)}</p>
      <ul class="${listClass}">${items}</ul>
    </div>
  `;
}
