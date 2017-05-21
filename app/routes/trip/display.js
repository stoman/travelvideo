import Ember from 'ember';

export default Ember.Route.extend({
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
            ret['nextVideo'] = trip.get('videos').objectAt((i + 1) % trip.get('videos.length'));
            ret['lastVideo'] = trip.get('videos').objectAt((i - 1 + trip.get('videos.length')) % trip.get('videos.length'));
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
    }
  }
});
