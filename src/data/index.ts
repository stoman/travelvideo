import rawVideos from './videos.json' with { type: 'json' };
import rawTrips from './trips.json' with { type: 'json' };
import type { Video, Trip } from './types';

export type { Video, Trip };

export const videos: Video[] = rawVideos as Video[];
export const realTrips: Trip[] = rawTrips as Trip[];

export const ALL_TRIP_ID = 'all';

const videoById = new Map(videos.map((v) => [v.id, v]));

/**
 * The `all` trip is derived, never stored -- storing it would duplicate every video id
 * and let it drift out of sync.
 */
const allTrip: Trip = {
  id: ALL_TRIP_ID,
  name: 'All Videos',
  year: '2013 - today',
  videos: [...videos]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((v) => v.id),
  finished: false,
};

/**
 * Real trips plus the derived `all` trip -- this is the list shown at /trip. Newest first (by
 * each trip's first video's date), with `all` pinned at the top rather than sorted by its own
 * meaningless, everything-spanning year.
 */
export const trips: Trip[] = [
  allTrip,
  ...[...realTrips].sort((a, b) => {
    const aDate = videoById.get(a.videos[0]!)?.date ?? '';
    const bDate = videoById.get(b.videos[0]!)?.date ?? '';
    return bDate.localeCompare(aDate);
  }),
];

const tripById = new Map(trips.map((t) => [t.id, t]));

export function getVideo(id: string): Video | undefined {
  return videoById.get(id);
}

export function getTrip(id: string): Trip | undefined {
  return tripById.get(id);
}

/**
 * Reverse index from video id to the real trips containing it. Built from realTrips only:
 * `all` is true of every video and carries no information on a video's detail page.
 */
const videoToTripsMap = new Map<string, Trip[]>();
for (const video of videos) {
  videoToTripsMap.set(video.id, []);
}
for (const trip of realTrips) {
  for (const videoId of trip.videos) {
    videoToTripsMap.get(videoId)?.push(trip);
  }
}

export function getTripsForVideo(videoId: string): Trip[] {
  return videoToTripsMap.get(videoId) ?? [];
}

export interface CountryGroup {
  country: string;
  videos: Video[];
}

/** Grouped for /video: sorted by country name, then by video name within each country. */
export const videosByCountry: CountryGroup[] = (() => {
  const byCountry = new Map<string, Video[]>();
  for (const video of videos) {
    const list = byCountry.get(video.country);
    if (list) {
      list.push(video);
    } else {
      byCountry.set(video.country, [video]);
    }
  }
  const groups = [...byCountry.entries()].map(([country, vids]) => ({
    country,
    videos: [...vids].sort((a, b) => a.name.localeCompare(b.name)),
  }));
  groups.sort((a, b) => a.country.localeCompare(b.country));
  return groups;
})();

/**
 * URL-safe id for a country name (`New Zealand` -> `new-zealand`), used for /country/:slug.
 * Country names are authored data, not user input -- a collision would be a data-quality bug
 * (caught by the invariant test below, see invariants.test.ts), not a security concern.
 */
export function countrySlug(country: string): string {
  return country
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics, e.g. an accented character
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const countryGroupBySlug = new Map(
  videosByCountry.map((g) => [countrySlug(g.country), g]),
);

export function getCountryGroup(slug: string): CountryGroup | undefined {
  return countryGroupBySlug.get(slug);
}

const MS_PER_DAY = 86_400_000;

/** Days strictly between two ISO dates. Zero or negative means "no gap to render". */
export function dayGap(dateA: string, dateB: string): number {
  const diff = Date.parse(dateB) - Date.parse(dateA);
  return Math.ceil(diff / MS_PER_DAY) - 1;
}

/** One gap per pair of consecutive videos in the trip's order (length = videos.length - 1). */
export function dayGapsForTrip(trip: Trip): number[] {
  const gaps: number[] = [];
  for (let i = 1; i < trip.videos.length; i++) {
    const prevId = trip.videos[i - 1]!;
    const currId = trip.videos[i]!;
    const prev = getVideo(prevId);
    const curr = getVideo(currId);
    if (!prev || !curr) {
      throw new Error(`Trip "${trip.id}" references a missing video`);
    }
    gaps.push(dayGap(prev.date, curr.date));
  }
  return gaps;
}

/** Shown as a heading on /video: "N Videos from M Countries". */
export const counts = {
  videos: videos.length,
  countries: videosByCountry.length,
};
