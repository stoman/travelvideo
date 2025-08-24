import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  metrics: service(),
  
  model(params) {
    const self = this;

    //log events
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
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
