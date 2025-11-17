import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class TripStartRoute extends Route {
  @service metrics;

  model(params) {
    const self = this;

    //log events
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'start',
        label: params.tripId,
      });
    });

    //redirect to first video
    this.store.findRecord('trip', params.tripId).then(function (trip) {
      self.transitionTo(
        'trip.display',
        params.tripId,
        trip.get('videos').objectAt(0).get('id'),
      );
    });
  }
}
