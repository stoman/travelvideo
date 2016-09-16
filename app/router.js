import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('paths');
  this.route('video', function() {
    this.route('display', { path: '/:videoId'});
  });
});

export default Router;
