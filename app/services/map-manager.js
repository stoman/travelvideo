/* globals ol */

import Service, { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class MapManagerService extends Service {
  @service router;
  @service store;
  @service metrics;

  backgroundMap = null;
  backgroundView = null;
  currentAfterMapCreationCallback = null;

  init() {
    super.init(...arguments);

    // Listen to route changes
    this.router.on('routeDidChange', this.handleRouteChange.bind(this));
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.router.off('routeDidChange', this.handleRouteChange.bind(this));
  }

  registerAfterMapCreationCallback(callback) {
    this.currentAfterMapCreationCallback = callback;
  }

  unregisterAfterMapCreationCallback() {
    this.currentAfterMapCreationCallback = null;
  }

  handleRouteChange(transition) {
    scheduleOnce('afterRender', this, () => {
      // Create map if not already done
      if (!this.backgroundMap) {
        this.initializeMap();
      }

      // Trigger afterMapCreation callback if registered
      if (this.currentAfterMapCreationCallback) {
        this.currentAfterMapCreationCallback();
      }
    });
  }

  initializeMap() {
    // Create open layers view object
    const view = new ol.View({
      center: ol.proj.fromLonLat([11.57, 48.13]), // Munich
      zoom: 4,
      minZoom: 2,
      maxZoom: 12,
    });

    // Create open layers map object
    const map = new ol.Map({
      // Predefined variables
      target: 'map',
      view: view,

      // Load tiles while flying to new places
      loadTilesWhileAnimating: true,

      // Load tiles
      layers: [
        // Stamen map
        new ol.layer.Tile({
          source: new ol.source.Stamen({
            layer: 'watercolor',
          }),
        }),
        // Labels for stamen map
        new ol.layer.Tile({
          source: new ol.source.Stamen({
            layer: 'terrain-labels',
          }),
        }),
      ],

      // No controls or interactions in most routes
      controls: [],
      interactions: [],
    });

    // Store map and view
    this.backgroundMap = map;
    this.backgroundView = view;

    // Add markers for videos
    this.store.query('video', {}).then((videos) => {
      videos.forEach((video) => {
        // Create marker object
        const label = document.createElement('div');
        label.appendChild(document.createTextNode(video.get('name')));
        label.classList.add('label');
        const icon = document.createElement('img');
        icon.setAttribute('src', '/assets/marker.png');
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.appendChild(icon);
        marker.appendChild(label);

        // Add marker as overlay
        map.addOverlay(
          new ol.Overlay({
            position: ol.proj.fromLonLat([
              video.get('longitude'),
              video.get('latitude'),
            ]),
            element: marker,
          }),
        );

        // Onclick event: go to video detail page
        icon.onclick = () => {
          this.router.transitionTo('video.display', video.id);
        };
      });
    });

    // Add trips to map
    this.store.query('trip', {}).then((trips) => {
      // Set up features
      const trip_features = [];
      trips.forEach((trip) => {
        // Compute a list of points, always start at home
        const points = [ol.proj.fromLonLat([11.500945, 48.144391])];
        trip.get('videos').forEach((video) => {
          points.push(
            ol.proj.fromLonLat([
              video.get('longitude'),
              video.get('latitude'),
            ]),
          );
        });

        // Close cycle
        if (trip.get('finished')) {
          points.push(points[0]);
        }

        // Create feature
        trip_features.push(
          new ol.Feature({
            geometry: new ol.geom.LineString(points),
          }),
        );
      });

      // Add trips as a new layer
      map.addLayer(
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: trip_features,
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: '#e74c3c', width: 5 }),
          }),
        }),
      );
    });

    // Set zoom level to map object
    map.on('moveend', () => {
      if (document.querySelector('#map')) {
        // Update CSS class
        document.querySelector('#map').className =
          'zoom-' + map.getView().getZoom();

        // Fire analytics events
        const center = ol.proj.toLonLat(map.getView().getCenter());
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'map-movement',
          action: 'zoom',
          value: map.getView().getZoom(),
        });
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'map-movement',
          action: 'longitude',
          value: center[0],
        });
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'map-movement',
          action: 'latitude',
          value: center[1],
        });
      }
    });
  }

  // Move the background map to given coordinates and zoom level
  moveBackgroundMap(lon, lat, zoomLevel) {
    const map = this.backgroundMap;
    const view = this.backgroundView;

    if (!map || !view) {
      return;
    }

    // Move to new location
    const pan = ol.animation.pan({
      duration: 5000,
      source: view.getCenter(),
    });
    map.beforeRender(pan);
    view.setCenter(ol.proj.fromLonLat([lon, lat]));

    // Zoom to new level
    const zoom = ol.animation.zoom({
      duration: 5000,
      resolution: map.getView().getResolution(),
    });
    map.beforeRender(zoom);
    view.setZoom(zoomLevel);
  }
}
