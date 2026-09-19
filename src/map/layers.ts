import * as maplibregl from 'maplibre-gl';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import { videosGeoJSON, tripRoutesGeoJSON } from './geojson.ts';
import { videos, trips } from '../data/index.ts';

const MARKERS_SOURCE_ID = 'videos';
const CLUSTER_LAYER_ID = 'clusters';
const CLUSTER_COUNT_LAYER_ID = 'cluster-count';
const UNCLUSTERED_LAYER_ID = 'unclustered-point';
const ROUTES_SOURCE_ID = 'trip-routes';
const ROUTES_LAYER_ID = 'trip-routes-line';

/**
 * Video markers as a single clustered GeoJSON source -- not DOM overlays. The current
 * OpenLayers implementation creates a div per video (177 of them, repositioned every frame of
 * every pan), which is the main reason it feels sluggish; a GPU-rendered GeoJSON source handles
 * this count trivially.
 */
export function addMarkerLayers(map: maplibregl.Map): void {
  map.addSource(MARKERS_SOURCE_ID, {
    type: 'geojson',
    data: videosGeoJSON(videos) as GeoJSON.FeatureCollection,
    cluster: true,
    clusterRadius: 40,
    clusterMaxZoom: 12,
  });

  map.addLayer({
    id: CLUSTER_LAYER_ID,
    type: 'circle',
    source: MARKERS_SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#c0533a',
      'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 50, 28],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff7ec',
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_LAYER_ID,
    type: 'symbol',
    source: MARKERS_SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 12,
      'text-font': ['Noto Sans Bold'],
    },
    paint: { 'text-color': '#fff7ec' },
  });

  map.addLayer({
    id: UNCLUSTERED_LAYER_ID,
    type: 'circle',
    source: MARKERS_SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#e8a33d',
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff7ec',
    },
  });
}

/** Tap an individual marker to navigate; tap a cluster to zoom into its bounds. */
export function wireMarkerInteractions(
  map: maplibregl.Map,
  navigate: (path: string) => void,
): void {
  map.on('click', UNCLUSTERED_LAYER_ID, (e: MapLayerMouseEvent) => {
    const id = e.features?.[0]?.properties?.['id'] as string | undefined;
    if (id) navigate(`/video/${id}`);
  });

  map.on('click', CLUSTER_LAYER_ID, (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    const clusterId = feature?.properties?.['cluster_id'] as number | undefined;
    if (clusterId === undefined || !feature) return;
    const source = map.getSource(MARKERS_SOURCE_ID) as maplibregl.GeoJSONSource;
    source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
      const [lon, lat] = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];
      map.easeTo({ center: [lon, lat], zoom });
    });
  });

  for (const layerId of [UNCLUSTERED_LAYER_ID, CLUSTER_LAYER_ID]) {
    map.on('mouseenter', layerId, (): void => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', layerId, (): void => {
      map.getCanvas().style.cursor = '';
    });
  }
}

/**
 * One line per real trip, home-anchored, looped when finished. Stroked in the site's existing
 * red so it reads clearly against the warm tile palette.
 */
export function addRouteLayer(map: maplibregl.Map): void {
  map.addSource(ROUTES_SOURCE_ID, {
    type: 'geojson',
    data: tripRoutesGeoJSON(trips) as GeoJSON.FeatureCollection,
  });

  map.addLayer({
    id: ROUTES_LAYER_ID,
    type: 'line',
    source: ROUTES_SOURCE_ID,
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': '#e74c3c',
      'line-width': 3,
      'line-opacity': 0.85,
    },
  });
}

/** Shows only the given trip's route (used when a single trip's overview is on screen). */
export function setVisibleTrip(
  map: maplibregl.Map,
  tripId: string | null,
): void {
  map.setFilter(ROUTES_LAYER_ID, tripId ? ['==', ['get', 'id'], tripId] : null);
}
