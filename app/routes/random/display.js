import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  metrics: service(),
  
  model(params) {
    return this.store.findRecord('video', params.videoId);
  },

  actions: {
    //move map to coordinates of the current video on loading
    afterMapCreation() {
      this.moveBackgroundMap(
        this.currentModel.get('longitude'),
        this.currentModel.get('latitude'),
        this.currentModel.get('preferredZoom')
      );
    },

    //log events
    didTransition() {
      scheduleOnce('afterRender', this, () => {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.currentModel.get('id')
        });
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-random',
          label: this.currentModel.get('id')
        });
      });
      return true;
    }
  }
});
