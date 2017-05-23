import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  
  model(params) {
    const self = this;

    //log events
    Ember.run.scheduleOnce('afterRender', this, () => {
      Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'start',
        label: params.tripId
      });
    });

    //redirect to first video
    this.store.findRecord('trip', params.tripId).then(function(trip) {
      self.transitionTo('trip.display', params.tripId, trip.get('videos').objectAt(0).get('id'));
    });
  },
});
