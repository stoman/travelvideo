import { moduleFor, test } from 'ember-qunit';

moduleFor('route:random/display', 'Unit | Route | random/display', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
