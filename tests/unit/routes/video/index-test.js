import { moduleFor, test } from 'ember-qunit';

moduleFor('route:video/index', 'Unit | Route | video/index', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
