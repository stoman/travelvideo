import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:index');
    assert.ok(route);
  });

  test('should transition to trip route', function(assert) {
    let route = this.owner.factoryFor('route:index').create({
      replaceWith(routeName) {
        assert.equal(routeName, 'trip', 'replace with route name trip');
      }
    });
    route.beforeModel();
  });
});
