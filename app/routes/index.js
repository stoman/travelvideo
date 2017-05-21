import Ember from 'ember';

export default Ember.Route.extend({
  //redirect the index route to the paths route
  beforeModel() {
  	this._super(...arguments);
    this.replaceWith('path');
  }
});
