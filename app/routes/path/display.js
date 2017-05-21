import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let self = this;
    //find path, then work with it
    return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
      self.store.findRecord('path', params.pathId).then(function(path) {
        //find video
        let ret = {
          video: self.store.findRecord('video', params.videoId),
          path: path
        };
        //search path for last and next video
        for(let i = 0; i < path.get('videos.length'); i++) {
          if(path.get('videos').objectAt(i).get('id') === params.videoId) {
            ret['nextVideo'] = path.get('videos').objectAt((i + 1) % path.get('videos.length'));
            ret['lastVideo'] = path.get('videos').objectAt((i - 1 + path.get('videos.length')) % path.get('videos.length'));
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
