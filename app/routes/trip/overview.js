/* globals ol */

import Ember from 'ember';
import { scheduleOnce } from '@ember/runloop';

export default Ember.Route.extend({
  model(params) {
    let self = this;

    //find the trip first
    return new Ember.RSVP.Promise(function (resolve /*, reject*/) {
      self.store.findRecord('trip', params.tripId).then(function (trip) {
        //compute offsets
        trip.get('videos').then(function (videos) {
          let videosWithOffsets = [];
          let lastVideo;
          for (let i = 0; i < videos.length; i++) {
            let offset = lastVideo
              ? Math.ceil(
                  (videos.objectAt(i).get('date').getTime() -
                    lastVideo.get('date').getTime()) /
                    1000 /
                    60 /
                    60 /
                    24,
                ) - 1
              : 0;
            videosWithOffsets.push({
              video: videos.objectAt(i),
              offset:
                offset <= 0 ? false : offset + ' day' + (offset > 1 ? 's' : ''),
            });
            lastVideo = videos.objectAt(i);
          }
          trip.set('videosWithOffsets', videosWithOffsets);

          //resolve promise
          resolve(trip);
        });
      });
    });
  },

  actions: {
    //show overview map
    didTransition() {
      let self = this;

      scheduleOnce('afterRender', this, () => {
        //create open layers map object
        let map = new ol.Map({
          //predefined variables
          target: 'overview-map',

          //load tiles
          layers: [
            //stamen map
            new ol.layer.Tile({
              source: new ol.source.Stamen({
                layer: 'watercolor',
              }),
            }),
          ],

          //no controls or interactions
          controls: [],
          interactions: [],
        });

        //compute a list of points, always start at home
        this.currentModel.get('videos').then(function (videos) {
          let points = [ol.proj.fromLonLat([11.500945, 48.144391])];
          videos.forEach(function (video) {
            points.push(
              ol.proj.fromLonLat([
                video.get('longitude'),
                video.get('latitude'),
              ]),
            );
          });

          //close cycle
          if (self.currentModel.get('finished')) {
            points.push(points[0]);
          }

          //add line to map as a new layer
          let lineLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [
                new ol.Feature({
                  geometry: new ol.geom.LineString(points),
                }),
              ],
            }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({ color: '#e74c3c', width: 5 }),
            }),
          });
          map.addLayer(lineLayer);

          //zoom map to line
          map.getView().fit(lineLayer.getSource().getExtent(), map.getSize());
        });
      });

      return true;
    },
  },
});
