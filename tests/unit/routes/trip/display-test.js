import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | trip/display', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:trip/display');
    assert.ok(route);
  });
});
