import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { action } from '@ember/object';

export default class TripDisplayRoute extends Route {
  @service metrics;
  @service mapManager;
  @service router;

  model(params) {
    const self = this;
    //find trip, then work with it
    return new Promise(function (resolve /*, reject*/) {
      self.store.findRecord('trip', params.tripId).then(function (trip) {
        //find video
        const ret = {
          video: self.store.findRecord('video', params.videoId),
          trip: trip,
        };
        //search trip for last and next video
        for (let i = 0; i < trip.get('videos.length'); i++) {
          if (trip.get('videos').objectAt(i).get('id') === params.videoId) {
            if (i < trip.get('videos.length') - 1) {
              ret['nextVideo'] = trip.get('videos').objectAt(i + 1);
            }
            if (i > 0) {
              ret['lastVideo'] = trip.get('videos').objectAt(i - 1);
            }
          }
        }
        //resolve promise => return
        resolve(ret);
      });
    });
  }

  activate() {
    super.activate(...arguments);
    this.router.on('routeDidChange', this, this.trackPageView);
    this.mapManager.registerAfterMapCreationCallback(
      this.afterMapCreation.bind(this),
    );
  }

  deactivate() {
    super.deactivate(...arguments);
    this.router.off('routeDidChange', this, this.trackPageView);
    this.mapManager.unregisterAfterMapCreationCallback();
  }

  trackPageView() {
    scheduleOnce('afterRender', this, () => {
      if (this.controller && this.controller.model) {
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.controller.model.video.get('id'),
        });
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-trip',
          label: this.controller.model.video.get('id'),
        });
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'trip',
          action: 'view-video',
          label: this.controller.model.trip.get('id'),
        });
      }
    });
  }

  //move map to coordinates of the current video on loading
  afterMapCreation() {
    this.mapManager.moveBackgroundMap(
      this.currentModel.video.get('longitude'),
      this.currentModel.video.get('latitude'),
      this.currentModel.video.get('preferredZoom'),
    );
  }

  //action for stopping the trip
  @action
  stopTrip() {
    //log event
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'stop-trip',
        label: this.currentModel.video.get('id'),
      });
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'stop-at-video',
        label: this.currentModel.trip.get('id'),
      });
    });

    //redirect to video page
    this.transitionTo('video.display', this.currentModel.video.get('id'));
  }
}
