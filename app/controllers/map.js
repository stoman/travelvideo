import Controller from '@ember/controller';

export default Controller.extend({
  //this property saves whether the hint should be displayed
  hintVisible: true,

  actions: {
    //hide the hint
    hideHint() {
      this.set('hintVisible', false);
    }
  }
});
