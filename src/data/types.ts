import type { Locale } from '../i18n/locale.ts';

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
 * Parsed shape of a URL. Every route lives under a `/en` or `/de` prefix (see
 * `src/i18n/locale.ts`). Redirect variants (`home-redirect`, `locale-redirect`,
 * `trip-start-redirect`, `random-redirect`) carry no renderable view of their own -- the router
 * resolves them to a concrete route using the data layer before dispatching to a view. See
 * router.ts. `locale-redirect` is the one redirect that doesn't know its locale yet (the URL
 * had no valid `/en`/`/de` prefix at all) -- it's resolved using the caller-supplied
 * `getPreferredLocale()`. `home-redirect` carries `locale` once a valid prefix was present but
 * nothing followed it (e.g. bare `/en`).
 */
export type Route =
  | { name: 'home-redirect'; locale: Locale } // '/:locale'
  | { name: 'locale-redirect'; path: string } // any path without a valid locale prefix
  | { name: 'about'; locale: Locale } // '/:locale/about'
  | { name: 'trips'; locale: Locale } // '/:locale/trip'
  | { name: 'trip-overview'; locale: Locale; tripId: string } // '/:locale/trip/:tripId'
  | { name: 'trip-start-redirect'; locale: Locale; tripId: string } // '/:locale/trip/start/:tripId'
  | {
      name: 'trip-display';
      locale: Locale;
      tripId: string;
      videoId: string;
    } // '/:locale/trip/:tripId/:videoId'
  | { name: 'videos'; locale: Locale } // '/:locale/video'
  | { name: 'video-display'; locale: Locale; videoId: string } // '/:locale/video/:videoId'
  | { name: 'country-overview'; locale: Locale; slug: string } // '/:locale/country/:slug'
  | { name: 'map'; locale: Locale } // '/:locale/map'
  | { name: 'random-redirect'; locale: Locale } // '/:locale/random'
  | { name: 'random-display'; locale: Locale; videoId: string } // '/:locale/random/:videoId'
  | { name: 'not-found'; locale: Locale };

/**
 * The subset of `Route` that `dispatch()` (router.ts) ever actually notifies a listener with --
 * every redirect variant is resolved (or turned into `not-found`) before that happens. Given
 * that guarantee, every member here carries a known `locale`.
 */
export type RenderableRoute = Exclude<
  Route,
  | { name: 'home-redirect' }
  | { name: 'locale-redirect' }
  | { name: 'trip-start-redirect' }
  | { name: 'random-redirect' }
>;
