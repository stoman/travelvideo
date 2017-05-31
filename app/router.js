import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      Ember.get(this, 'metrics').trackPage({page, title});
    });
  }
});

Router.map(function() {
  this.route('about');
  this.route('trip', function() {
    this.route('start', { path: '/start/:tripId'});
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
