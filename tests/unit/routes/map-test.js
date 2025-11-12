import { moduleFor, test } from 'ember-qunit';

moduleFor('route:map', 'Unit | Route | map', {
  needs: ['service:metrics'],
});

test('it exists', function (assert) {
  let route = this.subject();
  assert.ok(route);
});
