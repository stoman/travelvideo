import { moduleFor, test } from 'ember-qunit';

moduleFor('route:random/index', 'Unit | Route | random/index', {
  needs: ['service:metrics'],
});

test('it exists', function (assert) {
  let route = this.subject();
  assert.ok(route);
});
