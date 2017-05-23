import Ember from 'ember';

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
        this.currentModel.get('latitude')
      );
    },

    //log events
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.currentModel.get('id')
        });
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-random',
          label: this.currentModel.get('id')
        });
      });
      return true;
    }
  }
});
