import type { Route, RenderableRoute } from './data/types.ts';
import { getTrip, videos } from './data/index.ts';
import { isLocale, type Locale } from './i18n/locale.ts';

type RedirectRoute = Exclude<Route, RenderableRoute>;

/**
 * Pure string -> Route parsing, no data access, no DOM, no browser-language detection --
 * `getPreferredLocale` (passed into `initRouter`) is only consulted later, when resolving a
 * `locale-redirect`/localeless `home-redirect`. Segment-count-plus-literal-prefix matching is
 * enough for this route table; a routing library is not warranted. Order matters: within a
 * locale, `/trip/start/:tripId` must be checked before the general 2-segment `/trip/:tripId`
 * case, and before the 3-segment `/trip/:tripId/:videoId` case, since both start with `trip` too.
 */
export function parseRoute(pathname: string): Route {
  const allSegments = pathname.split('/').filter((s) => s.length > 0);

  const maybeLocale = allSegments[0];
  if (!maybeLocale || !isLocale(maybeLocale)) {
    return { name: 'locale-redirect', path: pathname };
  }
  const locale: Locale = maybeLocale;
  const segments = allSegments.slice(1);

  if (segments.length === 0) {
    return { name: 'home-redirect', locale };
  }

  const [first, second, third] = segments;

  if (first === 'about' && segments.length === 1) {
    return { name: 'about', locale };
  }

  if (first === 'trip') {
    if (segments.length === 1) {
      return { name: 'trips', locale };
    }
    if (segments.length === 3 && second === 'start') {
      return { name: 'trip-start-redirect', locale, tripId: third! };
    }
    if (segments.length === 2) {
      return { name: 'trip-overview', locale, tripId: second! };
    }
    if (segments.length === 3) {
      return { name: 'trip-display', locale, tripId: second!, videoId: third! };
    }
    return { name: 'not-found', locale };
  }

  if (first === 'video') {
    if (segments.length === 1) {
      return { name: 'videos', locale };
    }
    if (segments.length === 2) {
      return { name: 'video-display', locale, videoId: second! };
    }
    return { name: 'not-found', locale };
  }

  if (first === 'map' && segments.length === 1) {
    return { name: 'map', locale };
  }

  if (first === 'country') {
    if (segments.length === 2) {
      return { name: 'country-overview', locale, slug: second! };
    }
    return { name: 'not-found', locale };
  }

  if (first === 'random') {
    if (segments.length === 1) {
      return { name: 'random-redirect', locale };
    }
    if (segments.length === 2) {
      return { name: 'random-display', locale, videoId: second! };
    }
    return { name: 'not-found', locale };
  }

  return { name: 'not-found', locale };
}

/**
 * Replaces the leading `/en`/`/de` segment of an already locale-prefixed path with `newLocale`.
 * Pure string manipulation, used to build the language-switcher's target href.
 */
export function switchLocalePath(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/').filter((s) => s.length > 0);
  const rest =
    segments[0] && isLocale(segments[0]) ? segments.slice(1) : segments;
  return `/${[newLocale, ...rest].join('/')}`;
}

/**
 * Resolves a redirect-shaped route to a concrete path using the data layer and/or the
 * caller-supplied preferred-locale detector, or null if it can't be resolved (e.g. an unknown
 * trip id) -- the caller treats that as not-found.
 */
function resolveRedirectPath(
  route: Route,
  getPreferredLocale: () => Locale,
): string | null {
  switch (route.name) {
    case 'locale-redirect':
      return `/${getPreferredLocale()}${route.path}`;
    case 'home-redirect':
      return `/${route.locale}/trip`;
    case 'trip-start-redirect': {
      const trip = getTrip(route.tripId);
      const firstVideoId = trip?.videos[0];
      return firstVideoId
        ? `/${route.locale}/trip/${route.tripId}/${firstVideoId}`
        : null;
    }
    case 'random-redirect': {
      if (videos.length === 0) return null;
      const video = videos[Math.floor(Math.random() * videos.length)]!;
      return `/${route.locale}/random/${video.id}`;
    }
    default:
      return null;
  }
}

function isRedirect(route: Route): route is RedirectRoute {
  return (
    route.name === 'locale-redirect' ||
    route.name === 'home-redirect' ||
    route.name === 'trip-start-redirect' ||
    route.name === 'random-redirect'
  );
}

export type RouteListener = (route: RenderableRoute) => void;

let onRouteChange: RouteListener | null = null;
let getPreferredLocale: (() => Locale) | null = null;

// Insurance against a redirect-resolution bug looping forever; the real chains here are at
// most two hops (locale-redirect -> home-redirect -> concrete route).
const MAX_REDIRECT_HOPS = 5;

/** The locale to fall back to for a not-found: the route's own if it has one, else detected. */
function fallbackLocale(route: Route): Locale {
  return 'locale' in route ? route.locale : getPreferredLocale!();
}

/** Parses, resolves any redirect chain, updates history if it redirected, and notifies the listener. */
function dispatch(pathname: string): void {
  let route = parseRoute(pathname);
  let hops = 0;
  while (isRedirect(route)) {
    if (++hops > MAX_REDIRECT_HOPS) {
      route = { name: 'not-found', locale: fallbackLocale(route) };
      break;
    }
    const target = resolveRedirectPath(route, getPreferredLocale!);
    if (target) {
      history.replaceState(null, '', target);
      route = parseRoute(target);
    } else {
      route = { name: 'not-found', locale: fallbackLocale(route) };
    }
  }
  onRouteChange?.(route);
}

/** Pushes a new history entry and navigates to it. For internal navigation, not initial boot. */
export function navigate(path: string): void {
  history.pushState(null, '', path);
  dispatch(path);
}

function isModifiedOrNewTabClick(event: MouseEvent): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function onDocumentClick(event: MouseEvent): void {
  if (isModifiedOrNewTabClick(event)) return;

  const anchor = (event.target as Element).closest('a');
  if (!anchor) return;
  if (anchor.target && anchor.target !== '_self') return;
  if (anchor.hasAttribute('download')) return;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#')) return;

  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return;

  event.preventDefault();
  navigate(url.pathname);
}

/**
 * Boots the router: intercepts internal link clicks, listens for back/forward, and dispatches
 * the current location once. Call once at startup. `getLocale` supplies the preferred locale
 * (stored choice, else browser language) whenever a URL arrives without a valid `/en`/`/de`
 * prefix.
 */
export function initRouter(
  listener: RouteListener,
  getLocale: () => Locale,
): void {
  onRouteChange = listener;
  getPreferredLocale = getLocale;
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('popstate', () => dispatch(location.pathname));
  dispatch(location.pathname);
}
