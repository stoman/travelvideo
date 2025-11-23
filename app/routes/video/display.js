import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class VideoDisplayRoute extends Route {
  @service store;
  @service metrics;
  @service mapManager;

  model(params) {
    return this.store.findRecord('video', params.videoId);
  }

  activate() {
    super.activate(...arguments);
    this.mapManager.registerAfterMapCreationCallback(
      this.afterMapCreation.bind(this),
    );
  }

  deactivate() {
    super.deactivate(...arguments);
    this.mapManager.unregisterAfterMapCreationCallback();
  }

  afterModel(model) {
    super.afterModel(...arguments);
    // Track page view after model is loaded
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'view',
        label: model.get('id'),
      });
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'view-singleton',
        label: model.get('id'),
      });
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

  titleToken(model) {
    return model.get('name');
  }
}
