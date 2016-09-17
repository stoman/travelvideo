/* globals ol */

import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    //entering the route
    afterMapCreation() {
      //get map object
      let map = this.controllerFor('application').get('backgroundMap');

      //show controls
      map.addControl(new ol.control.Zoom());

      //add interactions
      ol.interaction.defaults().forEach(function(interaction) {
        map.addInteraction(interaction);
      });

      //hide content container above the map
      document.getElementById('content').style.display = 'none';
    },

    //leaving the route
    willTransition() {
      //get map object
      let map = this.controllerFor('application').get('backgroundMap');

      //remove all controls
      map.getControls().forEach(function(control) {
        map.removeControl(control);
      });

      //remove all interactions
      map.getInteractions().forEach(function(interaction) {
        map.removeInteraction(interaction);
      });

      //show content container
      document.getElementById('content').style.display = 'block';
    }
  }
});
