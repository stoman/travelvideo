import Application from '@ember/application';
import { run } from '@ember/runloop';
import OpenLayersInitializer from 'travelvideo/initializers/open-layers';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | open layers', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  test('it works', function(assert) {
    OpenLayersInitializer.initialize(application);
    assert.ok(true);
  });
});
