import { getVideo, dayGapsForTrip } from '../data/index.ts';
import type { Trip } from '../data/types.ts';

/**
 * /trip/:tripId: itinerary with day gaps. Trusted content, except tripId/videoId in hrefs --
 * those come from Trip/Video ids, which are simple slugs, not raw URL input.
 *
 * The route map fitted to this trip's bounds is added in Phase 5; this view covers everything
 * else.
 */
export function renderTripOverview(trip: Trip): string {
  const gaps = dayGapsForTrip(trip);

  const items = trip.videos
    .map((id, i) => {
      const video = getVideo(id)!;
      const gap = i > 0 ? gaps[i - 1]! : 0;
      const gapItem =
        gap > 0
          ? `<li class="day-gap">${gap} day${gap === 1 ? '' : 's'} without video</li>`
          : '';
      return `${gapItem}<li><a href="/trip/${trip.id}/${id}">${video.name}</a> — ${video.date}</li>`;
    })
    .join('');

  const firstVideoId = trip.videos[0];
  const cta = firstVideoId
    ? `<p><a href="/trip/${trip.id}/${firstVideoId}">Watch all the videos of this trip</a></p>`
    : '';

  return `
    <div class="trip-overview">
      <h1>${trip.name}</h1>
      <p>${trip.year}</p>
      <ol>${items}</ol>
      ${cta}
    </div>
  `;
}
