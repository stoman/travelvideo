import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class TripStartRoute extends Route {
  @service store;
  @service metrics;
  @service router;

  async model(params) {
    //log events
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'start',
        label: params.tripId,
      });
    });

    //redirect to first video
    const trip = await this.store.findRecord('trip', params.tripId);
    const videos = await trip.get('videos');
    if (videos && videos.length > 0) {
      this.router.transitionTo(
        'trip.display',
        params.tripId,
        videos[0].get('id'),
      );
    }
  }
}
