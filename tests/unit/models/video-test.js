/* globals Ember */

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('video', 'Unit | Model | video', {
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should have fixtures', function(assert) {
  assert.ok(
    Ember.get(this.store().modelFor('video'), 'FIXTURES').length > 0,
    'should have fixtures'
  );
});
