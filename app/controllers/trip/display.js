import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class TripDisplayController extends Controller {
  @service metrics;
  @service router;

  @action
  videoEnded() {
    if (this.model.nextVideo) {
      scheduleOnce('afterRender', this, () => {
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'trip',
          action: 'nextVideo',
          label: this.model.trip.id,
        });
      });
      this.router.transitionTo(
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
      this.router.transitionTo('trip.overview', this.model.trip.id);
    }
  }

  @action
  stopTrip() {
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'stop',
        label: this.model.trip.id,
      });
    });
    this.router.transitionTo('trip.overview', this.model.trip.id);
  }
}
