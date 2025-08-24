import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import config from 'travelvideo/config/environment';

<<<<<<< HEAD
const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      get(this, 'metrics').trackPage({page, title});
    });
  }
});

Router.map(function() {
  this.route('about');
  this.route('trip', function() {
    this.route('start', { path: '/start/:tripId'});
    this.route('overview', { path: '/:tripId'});
    this.route('display', { path: '/:tripId/:videoId'});
  });
  this.route('video', function() {
    this.route('display', { path: '/:videoId'});
  });
  this.route('map');
  this.route('random', function() {
    this.route('display', { path: '/:videoId'});
  });
});

export default Router;
=======
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
>>>>>>> 36304b7 (v2.18.2...v3.28.6)
