import { initRouter } from './router.ts';
import type { Route } from './data/types.ts';

const content = document.getElementById('content')!;

/**
 * Placeholder rendering for Phase 2 -- distinguishable per route so navigation can be verified
 * end to end before the real views land in Phase 3. Route params come from the URL, so they're
 * set via textContent on the heading, never interpolated into an HTML string.
 */
function renderPlaceholder(route: Route): void {
  const h1 = document.createElement('h1');
  switch (route.name) {
    case 'about':
      h1.textContent = 'About';
      break;
    case 'trips':
      h1.textContent = 'Trips';
      break;
    case 'trip-overview':
      h1.textContent = `Trip: ${route.tripId}`;
      break;
    case 'trip-display':
      h1.textContent = `Trip ${route.tripId} / Video ${route.videoId}`;
      break;
    case 'videos':
      h1.textContent = 'Videos';
      break;
    case 'video-display':
      h1.textContent = `Video: ${route.videoId}`;
      break;
    case 'map':
      h1.textContent = 'Map';
      break;
    case 'random-display':
      h1.textContent = `Random: ${route.videoId}`;
      break;
    case 'not-found':
      h1.textContent = 'Not found';
      break;
    // home-redirect, trip-start-redirect and random-redirect never reach here -- the router
    // resolves them to a concrete route (or not-found) before notifying this listener.
  }
  content.replaceChildren(h1);
}

initRouter(renderPlaceholder);
