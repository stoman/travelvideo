import Ember from 'ember';

export default Ember.Controller.extend({
  //this property saves whether the hint should be displayed
  hintVisible: true,

  actions: {
    //hide the hint
    hideHint() {
      this.set('hintVisible', false);
    }
  }
});
