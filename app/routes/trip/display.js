import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { action } from '@ember/object';

export default class TripDisplayRoute extends Route {
  @service store;
  @service metrics;
  @service mapManager;
  @service router;

  async model(params) {
    const trip = await this.store.findRecord('trip', params.tripId);
    const video = await this.store.findRecord('video', params.videoId);

    const ret = {
      video: video,
      trip: trip,
    };

    //search trip for last and next video
    const videos = await trip.get('videos');
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].get('id') === params.videoId) {
        if (i < videos.length - 1) {
          ret['nextVideo'] = videos[i + 1];
        }
        if (i > 0) {
          ret['lastVideo'] = videos[i - 1];
        }
      }
    }
    return ret;
  }

  activate() {
    super.activate(...arguments);
    this.mapManager.registerAfterMapCreationCallback(
      this.afterMapCreation.bind(this),
    );
  }

  deactivate() {
    super.deactivate(...arguments);
    this.mapManager.unregisterAfterMapCreationCallback();
  }

  afterModel(model) {
    super.afterModel(...arguments);
    // Track page view after model is loaded
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'view',
        label: model.video.get('id'),
      });
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'view-trip',
        label: model.video.get('id'),
      });
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'trip',
        action: 'view-video',
        label: model.trip.get('id'),
      });
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
    this.router.transitionTo(
      'video.display',
      this.currentModel.video.get('id'),
    );
  }
}
