import Ember from 'ember';

export default Ember.Route.extend({
  //redirect to a random video
  beforeModel() {
    const self = this;
    this.store.query('video', {sortBy: 'random', limit: 1}).then(function(videos) {
      self.transitionTo('random.display', videos.objectAt(0).get('id'));
    });
  }
});
