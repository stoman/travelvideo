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
import { tripRoutesGeoJSON } from './geojson.ts';
import { trips } from '../data/index.ts';

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

/** Flies to a video's location at its preferredZoom; jumps instead if motion is reduced. */
export function flyToVideo(lon: number, lat: number, zoom: number): void {
  withMap((map) => {
    if (prefersReducedMotion()) {
      map.jumpTo({ center: [lon, lat], zoom });
    } else {
      map.flyTo({ center: [lon, lat], zoom });
    }
  });
}

/** Shows only this trip's route, fitted to its bounds -- used by the trip overview. */
export function showTripFittedToBounds(tripId: string): void {
  withMap((map) => {
    setVisibleTrip(map, tripId);

    const feature = tripRoutesGeoJSON(trips).features.find(
      (f) => f.properties.id === tripId,
    );
    const coordinates = feature?.geometry.coordinates ?? [];
    if (coordinates.length === 0) return;

    const first = coordinates[0]!;
    const bounds = coordinates.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(first, first),
    );
    map.fitBounds(bounds, {
      padding: 48,
      duration: prefersReducedMotion() ? 0 : undefined,
    });
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
