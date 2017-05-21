import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    //video ended? go to next video
    videoEnded() {
      this.transitionToRoute('trip.display', this.get('model.trip.id'), this.get('model.nextVideo.id'));
    }
  }
});
