import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class RandomDisplayRoute extends Route {
  @service metrics;
  @service mapManager;
  @service router;

  model(params) {
    return this.store.findRecord('video', params.videoId);
  }

  activate() {
    super.activate(...arguments);
    this.router.on('routeDidChange', this, this.trackPageView);
    this.mapManager.registerAfterMapCreationCallback(
      this.afterMapCreation.bind(this),
    );
  }

  deactivate() {
    super.deactivate(...arguments);
    this.router.off('routeDidChange', this, this.trackPageView);
    this.mapManager.unregisterAfterMapCreationCallback();
  }

  trackPageView() {
    scheduleOnce('afterRender', this, () => {
      if (this.controller && this.controller.model) {
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view',
          label: this.controller.model.get('id'),
        });
        this.metrics.trackEvent('GoogleAnalytics', {
          category: 'video',
          action: 'view-random',
          label: this.controller.model.get('id'),
        });
      }
    });
  }

  //move map to coordinates of the current video on loading
  afterMapCreation() {
    this.mapManager.moveBackgroundMap(
      this.currentModel.get('longitude'),
      this.currentModel.get('latitude'),
      this.currentModel.get('preferredZoom'),
    );
  }
}
