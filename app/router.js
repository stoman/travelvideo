import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('path', function() {
    this.route('display', { path: '/:pathId/:videoId'});
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
