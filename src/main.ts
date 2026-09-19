import { initRouter } from './router.ts';
import type { Route } from './data/types.ts';
import { trips, videosByCountry, counts, getTrip, getVideo } from './data/index.ts';
import { renderAbout } from './views/about.ts';
import { renderTrips } from './views/trips.ts';
import { renderVideos } from './views/videos.ts';
import { renderTripOverview } from './views/trip-overview.ts';
import { renderVideoDisplay } from './views/video-display.ts';
import { renderNotFound } from './views/not-found.ts';

const content = document.getElementById('content')!;

/**
 * Placeholder rendering for routes not yet built out (Phase 3 in progress) -- distinguishable
 * per route so navigation can be verified end to end before the real view lands. Route params
 * come from the URL, so they're set via textContent on the heading, never interpolated into an
 * HTML string.
 */
function renderPlaceholder(route: Route): void {
  const h1 = document.createElement('h1');
  switch (route.name) {
    case 'trip-display':
      h1.textContent = `Trip ${route.tripId} / Video ${route.videoId}`;
      break;
    case 'map':
      h1.textContent = 'Map';
      break;
    case 'random-display':
      h1.textContent = `Random: ${route.videoId}`;
      break;
    case 'about':
    case 'trips':
    case 'videos':
    case 'trip-overview':
    case 'video-display':
    case 'not-found':
      // handled in render() before reaching here
      break;
    // home-redirect, trip-start-redirect and random-redirect never reach here -- the router
    // resolves them to a concrete route (or not-found) before notifying this listener.
  }
  content.replaceChildren(h1);
}

function render(route: Route): void {
  switch (route.name) {
    case 'about':
      content.innerHTML = renderAbout();
      return;
    case 'trips':
      content.innerHTML = renderTrips(trips);
      return;
    case 'videos':
      content.innerHTML = renderVideos(videosByCountry, counts);
      return;
    case 'trip-overview': {
      const trip = getTrip(route.tripId);
      content.innerHTML = trip ? renderTripOverview(trip) : renderNotFound();
      return;
    }
    case 'video-display': {
      const video = getVideo(route.videoId);
      content.innerHTML = video ? renderVideoDisplay(video) : renderNotFound();
      return;
    }
    case 'not-found':
      content.innerHTML = renderNotFound();
      return;
    default:
      renderPlaceholder(route);
  }
}

initRouter(render);
