import EmberRouter from '@ember/routing/router';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from 'travelvideo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
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
