import { moduleForModel, test } from 'ember-qunit';

moduleForModel('path', 'Unit | Model | path', {
  // Specify the other units that are required for this test.
  needs: ['model:video']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
