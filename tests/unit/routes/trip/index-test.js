import { moduleFor, test } from 'ember-qunit';

moduleFor('route:trip/index', 'Unit | Route | trip/index', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
