import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class TripDisplayController extends Controller {
  @service metrics;

  @action
  videoEnded() {
    if (this.model.nextVideo) {
      this.transitionToRoute(
        'trip.display',
        this.model.trip.id,
        this.model.nextVideo.id,
      );
    } else {
      //log events
      scheduleOnce('afterRender', this, () => {
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'trip',
          action: 'end',
          label: this.model.trip.id,
        });
      });

      //redirect to trip index page
      this.transitionToRoute('trip.overview', this.model.trip.id);
    }
  }

  @action
  stopTrip() {
    this.transitionToRoute('trip.overview', this.model.trip.id);
  }
}
