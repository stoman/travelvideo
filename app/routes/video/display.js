import Ember from 'ember';

export default Ember.Route.extend({
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
    }
  }
});
