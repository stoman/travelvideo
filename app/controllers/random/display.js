import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    //video ended? go to next video
    videoEnded() {
      const self = this;
      this.store.query('video', {filter: {peopleOut: this.get('model.peopleIn')}, sortBy: 'random', limit: 1}).then(function(videos) {
        self.transitionToRoute('random.display', videos.objectAt(0).get('id'));
      });
    }
  }
});
