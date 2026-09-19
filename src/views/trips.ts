import { getVideo } from '../data/index.ts';
import type { Trip } from '../data/types.ts';

/** /trip: list of trips -- name, year, and the video names within each. Trusted content. */
export function renderTrips(trips: Trip[]): string {
  const items = trips
    .map((trip) => {
      const videoNames = trip.videos
        .map((id) => getVideo(id)?.name ?? id)
        .join(', ');
      return `
        <li>
          <a href="/trip/${trip.id}">${trip.name}</a> (${trip.year})
          <p>${videoNames}</p>
        </li>
      `;
    })
    .join('');

  return `
    <div class="trips">
      <h1>Trips</h1>
      <ul>${items}</ul>
    </div>
  `;
}
