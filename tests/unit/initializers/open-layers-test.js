import Application from '@ember/application';
import { run } from '@ember/runloop';
import OpenLayersInitializer from 'travelvideo/initializers/open-layers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Initializer | open layers', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.application = Application.create();
    this.application.deferReadiness();
  });

  test('it works', function (assert) {
    run(() => {
      OpenLayersInitializer.initialize(this.application);
    });
    assert.ok(true);
  });
});
