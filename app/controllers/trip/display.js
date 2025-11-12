import Ember from 'ember';

export default Ember.Controller.extend({
  metrics: Ember.inject.service(),

  actions: {
    //video ended? go to next video
    videoEnded() {
      if (this.get('model.nextVideo')) {
        this.transitionToRoute(
          'trip.display',
          this.get('model.trip.id'),
          this.get('model.nextVideo.id'),
        );
      } else {
        //log events
        Ember.run.scheduleOnce('afterRender', this, () => {
          Ember.get(this, 'metrics').trackEvent('GoogleAnalytics', {
            category: 'trip',
            action: 'end',
            label: this.get('model.trip.id'),
          });
        });

        //redirect to trip index page
        this.transitionToRoute('trip.overview', this.get('model.trip.id'));
      }
    },
  },
});
