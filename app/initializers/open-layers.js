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
              zoom: 7
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
                //create marker object
                let marker = document.createElement('div');
                marker.classList.add('marker');
                marker.appendChild(document.createTextNode(video._data.name));
                let icon = document.createElement('img');
                icon.setAttribute('src', '/assets/marker.png');
                marker.appendChild(icon);

                //add marker as overlay
                map.addOverlay(new ol.Overlay({
                  position: ol.proj.fromLonLat([
                    video._data.longitude,
                    video._data.latitude
                  ]),
                  element: marker
                }));
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

      //set up flying animation
      let duration = 2000;
      let start = +new Date();
      let pan = ol.animation.pan({
        duration: duration,
        source: view.getCenter(),
        start: start
      });
      let bounce = ol.animation.bounce({
        duration: duration,
        resolution: 4 * view.getResolution(),
        start: start
      });
      map.beforeRender(pan, bounce);

      //move to actual location
      view.setCenter(ol.proj.fromLonLat([lon, lat]));
    }
  });
}

export default {
  name: 'open-layers',
  initialize
};
