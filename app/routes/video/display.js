import Ember from 'ember';
import { scheduleOnce } from '@ember/runloop';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),

  model(params) {
    return this.store.findRecord('video', params.videoId);
  },

  actions: {
    //move map to coordinates of the current video on loading
    afterMapCreation() {
      this.moveBackgroundMap(
        this.currentModel.get('longitude'),
        this.currentModel.get('latitude'),
        this.currentModel.get('preferredZoom'),
      );
    },

    //log events
    didTransition() {
      scheduleOnce('afterRender', this, () => {
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.currentModel.get('id'),
        });
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-singleton',
          label: this.currentModel.get('id'),
        });
      });
      return true;
    },
  },
});
