import type { CountryGroup } from '../data/index.ts';
import { formatDate } from '../format.ts';

/**
 * /country/:slug: every video filmed in this country, individually linked. Looks like
 * /trip/:tripId (trip-overview.ts) -- same box, same list styling -- but with no "watch all"
 * call to action: a country grouping has no itinerary order to chain playback through, unlike a
 * trip, so linking straight to each video (as /video already does) is the honest choice here.
 */
export function renderCountryOverview(group: CountryGroup): string {
  const items = group.videos
    .map(
      (v) =>
        `<li><a href="/video/${v.id}">${v.name}</a> — ${formatDate(v.date)}</li>`,
    )
    .join('');

  // Same single-vs-multi-column threshold as trip-overview.ts, for the same reason: short lists
  // read fine as one column, columns only earn their keep past that.
  const SINGLE_COLUMN_THRESHOLD = 10;
  const listClass =
    group.videos.length > SINGLE_COLUMN_THRESHOLD
      ? 'itinerary itinerary--columns'
      : 'itinerary';

  const count = group.videos.length;

  return `
    <div class="country-overview">
      <h1>${group.country}</h1>
      <p>${count} video${count === 1 ? '' : 's'}</p>
      <ul class="${listClass}">${items}</ul>
    </div>
  `;
}
