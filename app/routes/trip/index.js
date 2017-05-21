import Ember from 'ember';

export default Ember.Route.extend({
  model() {
	  //display all trips
  	return this.store.query('trip', {});
	}
});
