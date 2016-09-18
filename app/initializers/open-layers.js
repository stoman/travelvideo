/* globals ol */

import Ember from 'ember';

export function initialize() {
  //modify the didTransition action of all routes
  Ember.Route.reopen({
    actions: {
      didTransition() {
        //wait for afterRender event
        Ember.run.scheduleOnce('afterRender', this, function() {
          //create map if not already done
          if(!this.controllerFor('application').get('backgroundMap')) {

            //create open layers view object
            let view = new ol.View({
              center: ol.proj.fromLonLat([11.57, 48.13]),//Munich
              zoom: 4
            });

            //create open layers map object
            let map = new ol.Map({

              //predefined variables
              target: 'map',
              view: view,

              //load tiles while flying to new places
              loadTilesWhileAnimating: true,

              //load tiles
              layers: [
                //stamen map
                new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'watercolor'
                  })
                }),
                //labels for stamen map
                new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                  })
                })
                //OSM tiles
                /*new ol.layer.Tile({
                  source: new ol.source.OSM()
                })*/
              ],

              //no controls or interactions in most routes
              controls: [],
              interactions: []
            });

            //make map and view available for other components
            this.controllerFor('application').set('backgroundMap', map);
            this.controllerFor('application').set('backgroundView', view);

            //add markers for videos
            this.store.findAll('video').then(function(videos) {
              videos.get('content').forEach(function(video) {
                //add marker as overlay
                map.addOverlay(new ol.Overlay({
                  position: ol.proj.fromLonLat([
                    video._data.longitude,
                    video._data.latitude
                  ]),
                  element: document.querySelector('#marker-container .' + video.id + ' .marker')
                }));

                //add onclick event to trigger the link. This hack is neccessary
                //since open layers removes all onclick events from the marker while
                //moving it around.
                document.querySelector('#map .' + video.id).onclick = function() {
                  document.querySelector('#marker-container .' + video.id + ' a').click();
                  return false;
                };
              });
            });
          }
          //fire a custom afterMapCreation event to allow routes to move the map
          this.send('afterMapCreation');
        });
      },

      //fake implementation of the afterMapCreation event
      afterMapCreation() {}
    },

    //move the background map to given coordinates
    moveBackgroundMap(lon, lat) {
      //get open layers map and view objects
      let map = this.controllerFor('application').get('backgroundMap');
      let view = this.controllerFor('application').get('backgroundView');

      //move to new location
      let pan = ol.animation.pan({
        duration: 5000,
        source: view.getCenter()
      });
      map.beforeRender(pan);
      view.setCenter(ol.proj.fromLonLat([lon, lat]));

      //zoom to new level
      let zoom = ol.animation.zoom({
        duration: 5000,
        resolution: map.getView().getResolution(),
      });
      map.beforeRender(zoom);
      view.setZoom(7);
    },

    //add videos for markers to controller
    setupController(controller, model) {
      this._super(controller, model);
      this.controllerFor('application').set('videosForMarkers', this.store.findAll('video'));
    }
  });
}

export default {
  name: 'open-layers',
  initialize
};
