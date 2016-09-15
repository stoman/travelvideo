import Ember from 'ember';

export default Ember.Controller.extend({
  //the path that will be used to determine the next video
  activePath: null,

  //initialize `activePath` to the random path
  initializeActivePath() {
    if(!this.activePath) {
      this.activePath = this.store.findRecord('path', 'random');
    }
  },

  //an action to set a given path as the currently active path
  actions: {
    setActivePath(path) {
      this.set('activePath', path);
    }
  }
});
