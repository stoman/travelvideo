import { moduleFor, test } from 'ember-qunit';

moduleFor('route:video/display', 'Unit | Route | video/display', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
