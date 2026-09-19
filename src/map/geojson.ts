import { getVideo } from '../data/index.ts';
import type { Trip } from '../data/types.ts';

/** No maplibre-gl import here -- kept pure and cheap to test. */

interface PointFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: { id: string; name: string };
}

interface LineFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  properties: { id: string };
}

interface FeatureCollection<F> {
  type: 'FeatureCollection';
  features: F[];
}

/** Every video as a point feature, for the clustered marker source. */
export function videosGeoJSON(videos: { id: string; name: string; longitude: number; latitude: number }[]): FeatureCollection<PointFeature> {
  return {
    type: 'FeatureCollection',
    features: videos.map((v) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [v.longitude, v.latitude] },
      properties: { id: v.id, name: v.name },
    })),
  };
}

/** Munich home coordinate every trip route radiates from and, if finished, loops back to. */
export const HOME: [number, number] = [11.500945, 48.144391];

/**
 * One LineString per trip: home -> first video -> ... -> last video, looped back to home when
 * `finished`. The `all` pseudo-trip is excluded -- its line would connect every video on earth
 * into one meaningless polyline.
 */
export function tripRoutesGeoJSON(trips: Trip[]): FeatureCollection<LineFeature> {
  const realTrips = trips.filter((t) => t.id !== 'all');
  const features: LineFeature[] = realTrips.map((trip) => {
    const coordinates: [number, number][] = [HOME];
    for (const videoId of trip.videos) {
      const video = getVideo(videoId);
      if (video) coordinates.push([video.longitude, video.latitude]);
    }
    if (trip.finished) coordinates.push(HOME);
    return {
      type: 'Feature',
      properties: { id: trip.id },
      geometry: { type: 'LineString', coordinates },
    };
  });
  return { type: 'FeatureCollection', features };
}
