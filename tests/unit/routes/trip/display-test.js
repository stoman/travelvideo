import { moduleFor, test } from 'ember-qunit';

moduleFor('route:trip/display', 'Unit | Route | trip/display', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
