import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import Zoom from 'ol/control/Zoom';
import { defaults as defaultInteractions } from 'ol/interaction';

export default class MapRoute extends Route {
  @service mapManager;

  activate() {
    super.activate(...arguments);
    this.mapManager.registerAfterMapCreationCallback(
      this.afterMapCreation.bind(this),
    );
  }

  deactivate() {
    super.deactivate(...arguments);
    this.mapManager.unregisterAfterMapCreationCallback();
  }

  //entering the route
  afterMapCreation() {
    //get map object
    const map = this.mapManager.backgroundMap;

    //show controls
    map.addControl(new Zoom());

    //add interactions
    defaultInteractions().forEach(function (interaction) {
      map.addInteraction(interaction);
    });

    //hide content container above the map
    document.getElementById('content').style.visibility = 'hidden';
  }

  @action
  willTransition() {
    //get map object
    const map = this.mapManager.backgroundMap;

    //remove all controls
    map.getControls().forEach(function (control) {
      map.removeControl(control);
    });

    //remove all interactions
    map.getInteractions().forEach(function (interaction) {
      map.removeInteraction(interaction);
    });

    //show content container
    document.getElementById('content').style.visibility = 'visible';
  }

  titleToken = 'Map';
}
