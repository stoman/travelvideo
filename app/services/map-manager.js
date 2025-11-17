import Service, { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { fromLonLat, toLonLat } from 'ol/proj';

export default class MapManagerService extends Service {
  @service router;
  @service store;
  @service metrics;

  backgroundMap = null;
  backgroundView = null;
  currentAfterMapCreationCallback = null;
  handleRouteChangeBound = null;

  init() {
    super.init(...arguments);

    // Store bound handler so we can remove it later
    this.handleRouteChangeBound = this.handleRouteChange.bind(this);

    // Listen to route changes
    this.router.on('routeDidChange', this.handleRouteChangeBound);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    // Remove the exact same handler we added
    if (this.handleRouteChangeBound) {
      this.router.off('routeDidChange', this.handleRouteChangeBound);
    }
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
    const view = new View({
      center: fromLonLat([11.57, 48.13]), // Munich
      zoom: 4,
      minZoom: 2,
      maxZoom: 12,
    });

    // Create open layers map object
    const map = new Map({
      // Predefined variables
      target: 'map',
      view: view,

      // Load tiles while flying to new places
      loadTilesWhileAnimating: true,

      // Load tiles
      layers: [
        // OpenStreetMap tiles
        new TileLayer({
          source: new OSM(),
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
          new Overlay({
            position: fromLonLat([
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
        const points = [fromLonLat([11.500945, 48.144391])];
        trip.get('videos').forEach((video) => {
          points.push(
            fromLonLat([
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
          new Feature({
            geometry: new LineString(points),
          }),
        );
      });

      // Add trips as a new layer
      map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: trip_features,
          }),
          style: new Style({
            stroke: new Stroke({ color: '#e74c3c', width: 5 }),
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
        const center = toLonLat(map.getView().getCenter());
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

    // Animate to new location and zoom level using modern OpenLayers API
    view.animate({
      center: fromLonLat([lon, lat]),
      zoom: zoomLevel,
      duration: 5000,
    });
  }
}
