import Ember from 'ember';
import OpenLayersInitializer from 'travelvideo/initializers/open-layers';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | open layers', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  OpenLayersInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
