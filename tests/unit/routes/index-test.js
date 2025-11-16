import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:index');
    assert.ok(route);
  });

  test('should transition to trip route', function (assert) {
    assert.expect(1);
    const route = this.owner.lookup('route:index');
    route.router.replaceWith = function (routeName) {
      assert.strictEqual(routeName, 'trip.index', 'replace with route name trip.index');
    };
    route.beforeModel();
  });
});
