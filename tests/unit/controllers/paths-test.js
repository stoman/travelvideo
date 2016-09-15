import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:paths', 'Unit | Controller | paths', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['model:path']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
