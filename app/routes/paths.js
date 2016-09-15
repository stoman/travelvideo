import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    //call _super for default behavior
    this._super(controller, model);
    //make sure some path is loaded
    this.controllerFor('paths').initializeActivePath();
  },

  model() {
	  //display all paths
  	return this.store.findAll('path');
	}
});
