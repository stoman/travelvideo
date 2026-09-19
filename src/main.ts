import { initRouter, navigate } from './router.ts';
import type { Route } from './data/types.ts';
import {
  trips,
  videos,
  videosByCountry,
  counts,
  getTrip,
  getVideo,
  getCountryGroup,
} from './data/index.ts';
import { renderAbout } from './views/about.ts';
import { renderTrips } from './views/trips.ts';
import { renderVideos } from './views/videos.ts';
import { renderTripOverview } from './views/trip-overview.ts';
import { renderCountryOverview } from './views/country-overview.ts';
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
  showCountryFittedToBounds,
  showAllRoutes,
  showOnlyTripRoute,
  setFullGestureControl,
  type MapPadding,
} from './map/map.ts';

const content = document.getElementById('content')!;
const mapContainer = document.getElementById('map')!;
const navEl = document.getElementById('nav')!;

/**
 * The persistent map sits behind #content, but the current view's own box (paper card on
 * desktop, or the stacked video+details block on mobile) covers part of it -- "centered" has to
 * mean centered in whatever of the map is actually visible, not the full viewport. Desktop's box
 * hugs the left of #content without necessarily filling it (max-width: 1000px), so the map shows
 * through on the right; mobile stacks the box above the nav bar, so the map shows through in the
 * strip between them. Measured fresh on every call since box height/width depends on content.
 *
 * On a narrow-ish window the box can cover nearly the whole viewport, leaving only a sliver
 * genuinely free -- treating that whole sliver as padding leaves MapLibre nothing to fit/center
 * into (fitBounds silently refuses and logs a warning; flyTo has nowhere sensible to put the
 * point either). MIN_VISIBLE_PX keeps a floor of real map area, sliding under the box once it
 * gets that close, rather than chasing a sliver too thin to be useful anyway.
 */
const MIN_VISIBLE_PX = 300;

function currentMapPadding(): MapPadding {
  const box = content.firstElementChild as HTMLElement | null;
  if (!box) return { top: 0, right: 0, bottom: 0, left: 0 };
  const boxRect = box.getBoundingClientRect();

  if (window.matchMedia('(min-width: 768px)').matches) {
    const left = Math.min(
      Math.max(0, boxRect.right),
      Math.max(0, window.innerWidth - MIN_VISIBLE_PX),
    );
    return { top: 0, right: 0, bottom: 0, left };
  }

  const navRect = navEl.getBoundingClientRect();
  const top = Math.min(
    Math.max(0, boxRect.bottom),
    Math.max(0, window.innerHeight - MIN_VISIBLE_PX),
  );
  return {
    top,
    right: 0,
    bottom: Math.max(0, window.innerHeight - navRect.top),
    left: 0,
  };
}

/**
 * Camera position and gesture mode for the given route. The map loads asynchronously and is
 * very unlikely to be ready in time for the first route on a fresh page load; every function
 * this calls (flyToVideo, showTripFittedToBounds, showAllRoutes, showOnlyTripRoute,
 * setFullGestureControl) queues
 * itself against map readiness internally, so calling them here unconditionally is safe -- each
 * call takes effect once the map exists, in the order it was made.
 */
function syncMap(route: Route): void {
  setFullGestureControl(route.name === 'map');

  switch (route.name) {
    case 'trip-overview': {
      const trip = getTrip(route.tripId);
      if (trip) showTripFittedToBounds(trip, currentMapPadding());
      return;
    }
    case 'country-overview': {
      const group = getCountryGroup(route.slug);
      if (group) {
        showAllRoutes();
        showCountryFittedToBounds(group.videos, currentMapPadding());
      }
      return;
    }
    case 'video-display': {
      const video = getVideo(route.videoId);
      if (video) {
        showAllRoutes();
        flyToVideo(
          video.longitude,
          video.latitude,
          video.preferredZoom,
          currentMapPadding(),
        );
      }
      return;
    }
    case 'trip-display': {
      const trip = getTrip(route.tripId);
      const video = trip && getVideo(route.videoId);
      if (trip && video) {
        showOnlyTripRoute(trip.id);
        flyToVideo(
          video.longitude,
          video.latitude,
          video.preferredZoom,
          currentMapPadding(),
        );
      }
      return;
    }
    case 'random-display': {
      const video = getVideo(route.videoId);
      if (video) {
        showAllRoutes();
        flyToVideo(
          video.longitude,
          video.latitude,
          video.preferredZoom,
          currentMapPadding(),
        );
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
    case 'country-overview': {
      const group = getCountryGroup(route.slug);
      content.innerHTML = group
        ? renderCountryOverview(group)
        : renderNotFound();
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
