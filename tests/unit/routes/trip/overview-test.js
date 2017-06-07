import { moduleFor, test } from 'ember-qunit';

moduleFor('route:trip/overview', 'Unit | Route | trip/overview', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
