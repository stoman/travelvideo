import { moduleFor, test } from 'ember-qunit';

moduleFor('route:about', 'Unit | Route | about', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
