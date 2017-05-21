import Ember from 'ember';

export default Ember.Route.extend({
  //redirect the index route to the trips route
  beforeModel() {
  	this._super(...arguments);
    this.replaceWith('trip');
  }
});
