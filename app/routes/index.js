import Route from '@ember/routing/route';

export default Route.extend({
  //redirect the index route to the trips route
  beforeModel() {
  	this._super(...arguments);
    this.replaceWith('trip');
  }
});
