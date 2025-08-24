import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  metrics: service(),

  actions: {
    //video ended? go to next video
    videoEnded() {
      if(this.get('model.nextVideo')) {
        this.transitionToRoute('trip.display', this.get('model.trip.id'), this.get('model.nextVideo.id'));
      }
      else {
        //log events
        scheduleOnce('afterRender', this, () => {
          get(this, 'metrics').trackEvent('GoogleAnalytics', {
            category: 'trip',
            action: 'end',
            label: this.get('model.trip.id')
          });
        });

        //redirect to trip index page
        this.transitionToRoute('trip.overview', this.get('model.trip.id'));
      }
    }
  }
});
