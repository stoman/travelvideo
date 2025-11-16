import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | video/display', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:video/display');
    assert.ok(route);
  });
});
