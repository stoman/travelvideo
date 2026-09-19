import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// MapLibre 6 resolves its worker relative to import.meta.url in a way Vite's static worker
// detection can't see, so the plain package import 404s/hangs under both `vite` and `vite
// build`. Importing it through Vite's `?worker&url` suffix bundles the worker (and its sibling
// maplibre-gl-shared.mjs import) properly and hands back a URL that actually works; must be set
// before any Map is constructed.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { buildStyle } from './style.ts';
import {
  addMarkerLayers,
  wireMarkerInteractions,
  addRouteLayer,
  setVisibleTrip,
} from './layers.ts';
import { getVideo } from '../data/index.ts';
import type { Trip } from '../data/types.ts';

maplibregl.setWorkerUrl(maplibreWorkerUrl);

/** Existing default: Munich, at a zoom that shows most of Europe. */
const INITIAL_CENTER: [number, number] = [11.57, 48.13];
const INITIAL_ZOOM = 4;
const MIN_ZOOM = 2;
const MAX_ZOOM = 12;

let mapInstance: maplibregl.Map | null = null;
let readyPromise: Promise<maplibregl.Map> | null = null;

/**
 * One MapLibre instance, created once and never destroyed -- the entire reason this is a
 * single-page app. Views ask this module to fly somewhere; they never create or own the map.
 * Loads asynchronously so it never blocks first paint; call without awaiting at boot.
 */
export function initMap(
  container: HTMLElement,
  navigate: (path: string) => void,
): Promise<maplibregl.Map> {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    const style = await buildStyle();
    const map = new maplibregl.Map({
      container,
      style: style as maplibregl.StyleSpecification,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });
    mapInstance = map;
    map.on('error', (e) => console.error('Map error:', e.error));
    await new Promise<void>((resolve) => map.once('load', () => resolve()));
    addMarkerLayers(map);
    addRouteLayer(map);
    wireMarkerInteractions(map, navigate);
    return map;
  })();
  return readyPromise;
}

export function getMap(): maplibregl.Map | null {
  return mapInstance;
}

/**
 * Runs `fn` once the map is ready. The map takes a few seconds to load (base style fetch, then
 * MapLibre's own asset loading), so on a fresh page load every one of the camera/gesture
 * functions below is very likely to be called before that finishes. Queueing here -- rather
 * than the caller checking readiness and silently no-op-ing -- means a quick sequence of route
 * changes during that window (realistic during chained trip playback on a slow connection)
 * still applies every call in order once the map exists, instead of only the last one.
 */
function withMap(fn: (map: maplibregl.Map) => void): void {
  if (!readyPromise) return;
  void readyPromise.then(fn);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Screen-space padding, in pixels, for the part of the viewport a view's own content box
 * currently covers -- the persistent map sits behind it, so "centered" has to mean centered in
 * whatever's actually visible, not centered in the full (partly-occluded) viewport. Callers
 * measure their own box and pass it through; zero on every side is a plain full-viewport center.
 */
export interface MapPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const NO_PADDING: MapPadding = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * MapLibre's default flyTo duration is distance-based, so two videos a few streets apart (the
 * common case within a trip) jump almost instantly -- too fast to follow -- while only distant
 * jumps get a real animation. Pinning a flat duration makes every jump equally easy to track.
 */
const FLY_DURATION_MS = 1500;

/** Flies to a video's location at its preferredZoom; jumps instead if motion is reduced. */
export function flyToVideo(
  lon: number,
  lat: number,
  zoom: number,
  padding: MapPadding = NO_PADDING,
): void {
  withMap((map) => {
    if (prefersReducedMotion()) {
      map.jumpTo({ center: [lon, lat], zoom, padding });
    } else {
      map.flyTo({
        center: [lon, lat],
        zoom,
        padding,
        duration: FLY_DURATION_MS,
      });
    }
  });
}

/**
 * flyTo/jumpTo's own `padding` option doesn't just steer that one move -- it's stored as the
 * map's persistent padding (`map.getPadding()`), still in effect for whatever comes next.
 * fitBounds treats the padding it's given as *additional* to that persistent padding rather than
 * replacing it, so calling it right after a flyToVideo (every trip-display frame does one) added
 * the two together -- easily exceeding the canvas size for a geographically wide trip, which
 * silently fails the fit (MapLibre warns and leaves the camera wherever flyTo last put it, e.g.
 * still zoomed into the trip's last video instead of showing the whole route). Since every padding
 * passed here already describes the *complete* occlusion, clearing the persistent padding first
 * keeps fitBounds' own math from double-counting it.
 *
 * Even with that fixed, a box that occludes most of the canvas (a wide trip like a
 * round-the-world route combined with a wide overview card) can demand a zoom below the map's own
 * minZoom to fit everything in the sliver that's left -- MapLibre just clamps to minZoom then,
 * silently leaving far points outside the frame. Capping how much of each axis the padding may
 * claim keeps enough room that the fit stays achievable within minZoom for any trip this site has.
 */
const MAX_FIT_PADDING_FRACTION = 0.5;

function clampAxisPadding(a: number, b: number, size: number): [number, number] {
  const max = size * MAX_FIT_PADDING_FRACTION;
  if (a + b <= max) return [a, b];
  const scale = max / (a + b);
  return [a * scale, b * scale];
}

function fitToCoordinates(
  map: maplibregl.Map,
  coordinates: [number, number][],
  padding: MapPadding,
): void {
  if (coordinates.length === 0) return;

  const first = coordinates[0]!;
  const bounds = coordinates.reduce(
    (b, c) => b.extend(c),
    new maplibregl.LngLatBounds(first, first),
  );
  const canvas = map.getCanvas();
  const [left, right] = clampAxisPadding(
    padding.left + 48,
    padding.right + 48,
    canvas.clientWidth,
  );
  const [top, bottom] = clampAxisPadding(
    padding.top + 48,
    padding.bottom + 48,
    canvas.clientHeight,
  );
  map.setPadding(NO_PADDING);
  map.fitBounds(bounds, {
    padding: { top, right, bottom, left },
    duration: prefersReducedMotion() ? 0 : undefined,
  });
}

/**
 * Shows only this trip's route, fitted to its videos' own locations -- used by the trip
 * overview. Deliberately excludes the home coordinate the route line is anchored to/looped
 * through (see geojson.ts): fitting to that too would pull in Munich on every trip, however far
 * away its videos are, which is the point on the map the visitor came to see least.
 */
export function showTripFittedToBounds(
  trip: Trip,
  padding: MapPadding = NO_PADDING,
): void {
  withMap((map) => {
    setVisibleTrip(map, trip.id);

    const coordinates: [number, number][] = trip.videos
      .map((id) => getVideo(id))
      .filter((v) => v !== undefined)
      .map((v) => [v.longitude, v.latitude]);
    fitToCoordinates(map, coordinates, padding);
  });
}

/**
 * Fits to a country's own videos -- used by the country overview. A country has no route line
 * of its own (geojson.ts only draws trip lines), so this only moves the camera; the trip routes
 * stay visible as ambient background, same as /video's single-video view.
 */
export function showCountryFittedToBounds(
  countryVideos: { longitude: number; latitude: number }[],
  padding: MapPadding = NO_PADDING,
): void {
  withMap((map) => {
    const coordinates: [number, number][] = countryVideos.map((v) => [
      v.longitude,
      v.latitude,
    ]);
    fitToCoordinates(map, coordinates, padding);
  });
}

/** Shows every trip's route again -- used leaving a single-trip view. */
export function showAllRoutes(): void {
  withMap((map) => setVisibleTrip(map, null));
}

/** Full gesture control on /map; cooperative (two-finger pan) everywhere the map is a background. */
export function setFullGestureControl(enabled: boolean): void {
  withMap((map) => {
    if (enabled) {
      map.cooperativeGestures.disable();
    } else {
      map.cooperativeGestures.enable();
    }
  });
}
