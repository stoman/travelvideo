import { moduleFor, test } from 'ember-qunit';

moduleFor('route:index', 'Unit | Route | index', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});

test('should transition to trip route', function(assert) {
  let route = this.subject({
    replaceWith(routeName) {
      assert.equal(routeName, 'trip', 'replace with route name trip');
    }
  });
  route.beforeModel();
});
