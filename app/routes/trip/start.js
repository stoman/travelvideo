import Ember from 'ember';

export default Ember.Route.extend({
  //redirect to first video
  model(params) {
    const self = this;
    this.store.findRecord('trip', params.tripId).then(function(trip) {
      self.transitionTo('trip.display', params.tripId, trip.get('videos').objectAt(0).get('id'));
    });
  }
});
