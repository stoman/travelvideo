import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | random/display', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:random/display');
    assert.ok(controller);
  });
});
