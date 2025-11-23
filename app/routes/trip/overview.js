import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { fromLonLat } from 'ol/proj';

export default class TripOverviewRoute extends Route {
  @service router;
  @service store;

  async model(params) {
    //find the trip first
    const trip = await this.store.findRecord('trip', params.tripId);

    //compute offsets
    const videos = await trip.get('videos');
    const videosWithOffsets = [];
    let lastVideo;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const date = new Date(video.get('date'));
      const lastDate = lastVideo ? new Date(lastVideo.get('date')) : null;

      const offset = lastVideo
        ? Math.ceil(
            (date.getTime() - lastDate.getTime()) / 1000 / 60 / 60 / 24,
          ) - 1
        : 0;
      videosWithOffsets.push({
        video: video,
        offset: offset <= 0 ? false : offset + ' day' + (offset > 1 ? 's' : ''),
      });
      lastVideo = video;
    }
    trip.set('videosWithOffsets', videosWithOffsets);

    return trip;
  }

  afterModel() {
    super.afterModel(...arguments);
    // Show overview map after model is loaded

    scheduleOnce('afterRender', this, async () => {
      //create open layers map object
      const map = new Map({
        //predefined variables
        target: 'overview-map',
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),

        //load tiles
        layers: [
          // OpenStreetMap tiles
          new TileLayer({
            source: new OSM(),
          }),
        ],

        //no controls or interactions
        controls: [],
        interactions: [],
      });

      //compute a list of points, always start at home
      const videos = await this.currentModel.get('videos');
      const points = [fromLonLat([11.500945, 48.144391])];
      videos.forEach((video) => {
        points.push(
          fromLonLat([video.get('longitude'), video.get('latitude')]),
        );
      });

      //close cycle
      if (this.currentModel.get('finished')) {
        points.push(points[0]);
      }

      //add line to map as a new layer
      const lineLayer = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new LineString(points),
            }),
          ],
        }),
        style: new Style({
          stroke: new Stroke({ color: '#e74c3c', width: 5 }),
        }),
      });
      map.addLayer(lineLayer);

      //zoom map to line
      map.getView().fit(lineLayer.getSource().getExtent(), map.getSize());
    });
  }

  titleToken(model) {
    return model.get('name');
  }
}
