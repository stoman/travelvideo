import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  
  model(params) {
    let self = this;
    //find trip, then work with it
    return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
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
        this.currentModel.video.get('latitude')
      );
    },

    //log events
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.currentModel.video.get('id')
        });
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-trip',
          label: this.currentModel.video.get('id')
        });
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
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
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'stop-trip',
          label: this.currentModel.video.get('id')
        });
        Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
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
