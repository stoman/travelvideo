import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | trip/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:trip/index');
    assert.ok(route);
  });
});
