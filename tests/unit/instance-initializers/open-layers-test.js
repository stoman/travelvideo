import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import OpenLayersInitializer from 'travelvideo/instance-initializers/open-layers';

module('Unit | Instance Initializer | open layers', function (hooks) {
  setupTest(hooks);

  test('it works', function (assert) {
    OpenLayersInitializer.initialize(this.owner);
    assert.ok(true);
  });
});
