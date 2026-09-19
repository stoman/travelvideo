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
import { renderNotFound } from './views/not-found.ts';
import {
  nextVideoIdInTrip,
  pickChainedVideo,
  attachEndedHandler,
  prefetchVideo,
} from './video/player.ts';

const content = document.getElementById('content')!;

/** Map view lands in Phase 5; everything else is built. */
function renderMapPlaceholder(): void {
  const h1 = document.createElement('h1');
  h1.textContent = 'Map';
  content.replaceChildren(h1);
}

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
    case 'trip-display':
      renderTripDisplayRoute(route.tripId, route.videoId);
      return;
    case 'random-display':
      renderRandomDisplayRoute(route.videoId);
      return;
    case 'map':
      renderMapPlaceholder();
      return;
    case 'not-found':
      content.innerHTML = renderNotFound();
      return;
    // home-redirect, trip-start-redirect and random-redirect never reach here -- the router
    // resolves them to a concrete route (or not-found) before notifying this listener.
  }
}

initRouter(render);
