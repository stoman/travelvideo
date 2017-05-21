import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    //video ended? go to next video
    videoEnded() {
      this.transitionToRoute('path.display', this.get('model.path.id'), this.get('model.nextVideo.id'));
    }
  }
});
