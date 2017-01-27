/* globals ol */

import Ember from 'ember';

export function initialize() {
  //modify the didTransition action of all routes
  Ember.Route.reopen({
    actions: {
      didTransition() {
        const route = this;

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
                })
                //labels for stamen map
                /*new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                  })
                })*/
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
            this.store.query('video', {}).then(function(videos) {
              videos.forEach(function(video) {
                //create marker object
                let label = document.createElement('div');
                label.appendChild(document.createTextNode(video.get('name')));
                label.classList.add('label');
                let icon = document.createElement('img');
                icon.setAttribute('src', '/assets/marker.png');
                let marker = document.createElement('div');
                marker.classList.add('marker');
                marker.appendChild(icon);
                marker.appendChild(label);

                //add marker as overlay
                map.addOverlay(new ol.Overlay({
                  position: ol.proj.fromLonLat([
                    video.get('longitude'),
                    video.get('latitude')
                  ]),
                  element: marker
                }));

                //onlick event: go to video detail page
                icon.onclick = function() {
                  route.transitionTo('video.display', video.id);
                };
              });
            });

            //add paths to map
            this.store.query('path', {}).then(function(paths) {

              //set up features
              let path_features = [];
              paths.forEach(function(path) {

                //compute a list of points
                let points = [];
                path.get('videos').forEach(function(video) {
                  points.push(ol.proj.fromLonLat([
                    video.get('longitude'),
                    video.get('latitude')
                  ]));
                });

                //close cycle
                points.push(points[0]);

                //create feature
                path_features.push(new ol.Feature({
                  geometry: new ol.geom.LineString(points)
                }));
              });

              //add paths as a new layer
              map.addLayer(new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: path_features
                }),
                style: new ol.style.Style({
                  stroke: new ol.style.Stroke({ color: '#e74c3c', width: 5})
                })
              }));
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
    }
  });
}

export default {
  name: 'open-layers',
  initialize
};
