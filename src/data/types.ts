export interface Video {
  id: string;
  name: string;
  description: string;
  country: string;
  filename: string;
  /** ISO YYYY-MM-DD. Kept as a string at rest; parse at use. */
  date: string;
  latitude: number;
  longitude: number;
  peopleIn: string;
  peopleOut: string;
  peopleStart: string;
  peopleEnd: string;
  guests: string;
  camera: string;
  preferredZoom: number;
}

export interface Trip {
  id: string;
  name: string;
  year: string;
  /** Ordered video ids; order is the itinerary, not incidental. */
  videos: string[];
  finished: boolean;
}

/**
 * Parsed shape of a URL. Redirect variants (`home-redirect`, `trip-start-redirect`,
 * `random-redirect`) carry no renderable view of their own -- the router resolves them to a
 * concrete route using the data layer before dispatching to a view. See router.ts.
 */
export type Route =
  | { name: 'home-redirect' } // '/'
  | { name: 'about' } // '/about'
  | { name: 'trips' } // '/trip'
  | { name: 'trip-overview'; tripId: string } // '/trip/:tripId'
  | { name: 'trip-start-redirect'; tripId: string } // '/trip/start/:tripId'
  | { name: 'trip-display'; tripId: string; videoId: string } // '/trip/:tripId/:videoId'
  | { name: 'videos' } // '/video'
  | { name: 'video-display'; videoId: string } // '/video/:videoId'
  | { name: 'country-overview'; slug: string } // '/country/:slug'
  | { name: 'map' } // '/map'
  | { name: 'random-redirect' } // '/random'
  | { name: 'random-display'; videoId: string } // '/random/:videoId'
  | { name: 'not-found' };
