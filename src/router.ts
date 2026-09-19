import type { Route } from './data/types.ts';
import { getTrip, videos } from './data/index.ts';

/**
 * Pure string -> Route parsing, no data access, no DOM. Segment-count-plus-literal-prefix
 * matching is enough for this route table; a routing library is not warranted. Order matters:
 * `/trip/start/:tripId` must be checked before the general 2-segment `/trip/:tripId` case, and
 * before the 3-segment `/trip/:tripId/:videoId` case, since both start with `trip` too.
 */
export function parseRoute(pathname: string): Route {
  const segments = pathname.split('/').filter((s) => s.length > 0);

  if (segments.length === 0) {
    return { name: 'home-redirect' };
  }

  const [first, second, third] = segments;

  if (first === 'about' && segments.length === 1) {
    return { name: 'about' };
  }

  if (first === 'trip') {
    if (segments.length === 1) {
      return { name: 'trips' };
    }
    if (segments.length === 3 && second === 'start') {
      return { name: 'trip-start-redirect', tripId: third! };
    }
    if (segments.length === 2) {
      return { name: 'trip-overview', tripId: second! };
    }
    if (segments.length === 3) {
      return { name: 'trip-display', tripId: second!, videoId: third! };
    }
    return { name: 'not-found' };
  }

  if (first === 'video') {
    if (segments.length === 1) {
      return { name: 'videos' };
    }
    if (segments.length === 2) {
      return { name: 'video-display', videoId: second! };
    }
    return { name: 'not-found' };
  }

  if (first === 'map' && segments.length === 1) {
    return { name: 'map' };
  }

  if (first === 'random') {
    if (segments.length === 1) {
      return { name: 'random-redirect' };
    }
    if (segments.length === 2) {
      return { name: 'random-display', videoId: second! };
    }
    return { name: 'not-found' };
  }

  return { name: 'not-found' };
}

/**
 * Resolves a redirect-shaped route to a concrete path using the data layer, or null if it
 * can't be resolved (e.g. an unknown trip id) -- the caller treats that as not-found.
 */
function resolveRedirectPath(route: Route): string | null {
  switch (route.name) {
    case 'home-redirect':
      return '/trip';
    case 'trip-start-redirect': {
      const trip = getTrip(route.tripId);
      const firstVideoId = trip?.videos[0];
      return firstVideoId ? `/trip/${route.tripId}/${firstVideoId}` : null;
    }
    case 'random-redirect': {
      if (videos.length === 0) return null;
      const video = videos[Math.floor(Math.random() * videos.length)]!;
      return `/random/${video.id}`;
    }
    default:
      return null;
  }
}

function isRedirect(route: Route): boolean {
  return (
    route.name === 'home-redirect' ||
    route.name === 'trip-start-redirect' ||
    route.name === 'random-redirect'
  );
}

export type RouteListener = (route: Route) => void;

let onRouteChange: RouteListener | null = null;

/** Parses, resolves any redirect, updates history if it redirected, and notifies the listener. */
function dispatch(pathname: string): void {
  let route = parseRoute(pathname);
  if (isRedirect(route)) {
    const target = resolveRedirectPath(route);
    if (target) {
      history.replaceState(null, '', target);
      route = parseRoute(target);
    } else {
      route = { name: 'not-found' };
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
 * the current location once. Call once at startup.
 */
export function initRouter(listener: RouteListener): void {
  onRouteChange = listener;
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('popstate', () => dispatch(location.pathname));
  dispatch(location.pathname);
}
