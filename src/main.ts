import { initRouter, navigate } from './router.ts';
import type { Route } from './data/types.ts';
import { trips, videos, videosByCountry, counts, getTrip, getVideo } from './data/index.ts';
import { renderAbout } from './views/about.ts';
import { renderTrips } from './views/trips.ts';
import { renderVideos } from './views/videos.ts';
import { renderTripOverview } from './views/trip-overview.ts';
import { renderVideoDisplay } from './views/video-display.ts';
import { renderTripDisplay } from './views/trip-display.ts';
import { renderRandomDisplay } from './views/random-display.ts';
import { renderMap } from './views/map.ts';
import { renderNotFound } from './views/not-found.ts';
import {
  nextVideoIdInTrip,
  pickChainedVideo,
  attachEndedHandler,
  prefetchVideo,
} from './video/player.ts';
import {
  initMap,
  flyToVideo,
  showTripFittedToBounds,
  showAllRoutes,
  setFullGestureControl,
} from './map/map.ts';

const content = document.getElementById('content')!;
const mapContainer = document.getElementById('map')!;

/**
 * Camera position and gesture mode for the given route. The map loads asynchronously and is
 * very unlikely to be ready in time for the first route on a fresh page load; every function
 * this calls (flyToVideo, showTripFittedToBounds, showAllRoutes, setFullGestureControl) queues
 * itself against map readiness internally, so calling them here unconditionally is safe -- each
 * call takes effect once the map exists, in the order it was made.
 */
function syncMap(route: Route): void {
  setFullGestureControl(route.name === 'map');

  switch (route.name) {
    case 'trip-overview': {
      const trip = getTrip(route.tripId);
      if (trip) showTripFittedToBounds(trip.id);
      return;
    }
    case 'video-display': {
      const video = getVideo(route.videoId);
      if (video) {
        showAllRoutes();
        flyToVideo(video.longitude, video.latitude, video.preferredZoom);
      }
      return;
    }
    case 'trip-display': {
      const trip = getTrip(route.tripId);
      const video = trip && getVideo(route.videoId);
      if (video) {
        showAllRoutes();
        flyToVideo(video.longitude, video.latitude, video.preferredZoom);
      }
      return;
    }
    case 'random-display': {
      const video = getVideo(route.videoId);
      if (video) {
        showAllRoutes();
        flyToVideo(video.longitude, video.latitude, video.preferredZoom);
      }
      return;
    }
    case 'map':
      showAllRoutes();
      return;
    case 'about':
    case 'trips':
    case 'videos':
    case 'not-found':
      // Map remains a background at whatever position it held, per ui-design.md.
      return;
  }
}

// Loads asynchronously; never blocks first content paint.
void initMap(mapContainer, navigate);

function renderTripDisplayRoute(tripId: string, videoId: string): void {
  const trip = getTrip(tripId);
  const video = trip && getVideo(videoId);
  if (!trip || !video) {
    content.innerHTML = renderNotFound();
    return;
  }
  content.innerHTML = renderTripDisplay(trip, video);

  const videoEl = content.querySelector('video')!;
  const nextId = nextVideoIdInTrip(trip, video.id);
  if (nextId) {
    prefetchVideo(getVideo(nextId)!.filename);
    attachEndedHandler(videoEl, () => navigate(`/trip/${trip.id}/${nextId}`));
  } else {
    // Last video in the trip: end at the overview, not a dead frame.
    attachEndedHandler(videoEl, () => navigate(`/trip/${trip.id}`));
  }
}

function renderRandomDisplayRoute(videoId: string): void {
  const video = getVideo(videoId);
  if (!video) {
    content.innerHTML = renderNotFound();
    return;
  }
  content.innerHTML = renderRandomDisplay(video);

  const videoEl = content.querySelector('video')!;
  // Chosen once, ahead of time, so the prefetched clip is the one actually played next.
  const next = pickChainedVideo(video, videos);
  prefetchVideo(next.filename);
  attachEndedHandler(videoEl, () => navigate(`/random/${next.id}`));
}

function render(route: Route): void {
  switch (route.name) {
    case 'about':
      content.innerHTML = renderAbout();
      break;
    case 'trips':
      content.innerHTML = renderTrips(trips);
      break;
    case 'videos':
      content.innerHTML = renderVideos(videosByCountry, counts);
      break;
    case 'trip-overview': {
      const trip = getTrip(route.tripId);
      content.innerHTML = trip ? renderTripOverview(trip) : renderNotFound();
      break;
    }
    case 'video-display': {
      const video = getVideo(route.videoId);
      content.innerHTML = video ? renderVideoDisplay(video) : renderNotFound();
      break;
    }
    case 'trip-display':
      renderTripDisplayRoute(route.tripId, route.videoId);
      break;
    case 'random-display':
      renderRandomDisplayRoute(route.videoId);
      break;
    case 'map':
      content.innerHTML = renderMap();
      break;
    case 'not-found':
      content.innerHTML = renderNotFound();
      break;
    // home-redirect, trip-start-redirect and random-redirect never reach here -- the router
    // resolves them to a concrete route (or not-found) before notifying this listener.
  }

  syncMap(route);
}

initRouter(render);
