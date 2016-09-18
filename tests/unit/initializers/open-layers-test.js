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

test('it works', function(assert) {
  OpenLayersInitializer.initialize(application);
  assert.ok(true);
});
