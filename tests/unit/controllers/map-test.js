import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | map', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:map');
    assert.ok(controller);
  });

  test('hint visible by default', function (assert) {
    const controller = this.owner.lookup('controller:map');
    assert.strictEqual(controller.hintVisible, true);
  });

  test('hint can be hidden by action hideHint', function (assert) {
    const controller = this.owner.lookup('controller:map');
    controller.send('hideHint');
    assert.strictEqual(controller.hintVisible, false);
  });
});
