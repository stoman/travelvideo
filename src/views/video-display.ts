import { getTripsForVideo } from '../data/index.ts';
import type { Video } from '../data/types.ts';

/**
 * /video/:videoId: full metadata and trip membership. Trusted content. Mirrors the fields the
 * current video-listing component shows (name, description, country, date, coordinates,
 * guests, camera) -- peopleIn/Out/Start/End aren't shown today either, so this doesn't add them.
 *
 * The video element itself (with controls, per ui-design.md) is Phase 4's addition to this view.
 */
export function renderVideoDisplay(video: Video): string {
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
    <div class="video-display">
      <h1>${video.name}</h1>
      ${video.description ? `<p>${video.description}</p>` : ''}
      <p>Country: ${video.country}</p>
      <p>Date: ${video.date}</p>
      <p>Latitude: ${video.latitude}</p>
      <p>Longitude: ${video.longitude}</p>
      ${video.guests ? `<p>Guests: ${video.guests}</p>` : ''}
      ${video.camera ? `<p>Camera: ${video.camera}</p>` : ''}
      ${tripsSection}
    </div>
  `;
}
