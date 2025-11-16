import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | trip/overview', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:trip/overview');
    assert.ok(route);
  });
});
