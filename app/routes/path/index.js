import Ember from 'ember';

export default Ember.Route.extend({
  model() {
	  //display all paths
  	return this.store.query('path', {});
	}
});
