import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  metrics: service(),
  
  model(params) {
    let self = this;
    //find trip, then work with it
    return new Promise(function(resolve/*, reject*/) {
      self.store.findRecord('trip', params.tripId).then(function(trip) {
        //find video
        let ret = {
          video: self.store.findRecord('video', params.videoId),
          trip: trip
        };
        //search trip for last and next video
        for(let i = 0; i < trip.get('videos.length'); i++) {
          if(trip.get('videos').objectAt(i).get('id') === params.videoId) {
            if(i < trip.get('videos.length') - 1) {
              ret['nextVideo'] = trip.get('videos').objectAt(i + 1);
            }
            if(i > 0) {
              ret['lastVideo'] = trip.get('videos').objectAt(i - 1);
            }
          }
        }
        //resolve promise => return
        resolve(ret);
      });
    });
  },

  actions: {
    //move map to coordinates of the current video on loading
    afterMapCreation() {
      this.moveBackgroundMap(
        this.currentModel.video.get('longitude'),
        this.currentModel.video.get('latitude'),
        this.currentModel.video.get('preferredZoom')
      );
    },

    //log events
    didTransition() {
      scheduleOnce('afterRender', this, () => {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.currentModel.video.get('id')
        });
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-trip',
          label: this.currentModel.video.get('id')
        });
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'trip',
          action: 'view-video',
          label: this.currentModel.trip.get('id')
        });
      });
      return true;
    },

    //action for stopping the trip
    stopTrip() {
      //log event
      scheduleOnce('afterRender', this, () => {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'stop-trip',
          label: this.currentModel.video.get('id')
        });
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'trip',
          action: 'stop-at-video',
          label: this.currentModel.trip.get('id')
        });
      });

      //redirect to video page
      this.transitionTo('video.display', this.currentModel.video.get('id'));
    }
  }
});
