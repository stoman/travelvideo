import EmberRouter from '@ember/routing/router';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from 'travelvideo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  @service metrics;

  constructor() {
    super(...arguments);
    // Listen to route changes for analytics tracking
    this.on('routeDidChange', () => {
      this._trackPage();
    });
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });
    });
  }
}

Router.map(function () {
  this.route('about');
  this.route('trip', function () {
    this.route('start', { path: '/start/:tripId' });
    this.route('overview', { path: '/:tripId' });
    this.route('display', { path: '/:tripId/:videoId' });
  });
  this.route('video', function () {
    this.route('display', { path: '/:videoId' });
  });
  this.route('map');
  this.route('random', function () {
    this.route('display', { path: '/:videoId' });
  });
});
