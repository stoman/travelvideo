/* globals Ember */

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('video', 'Unit | Model | video', {
  needs: ['model:trip']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should have trips', function(assert) {
  const Video = this.store().modelFor('video');
  const relationship = Ember.get(Video, 'relationshipsByName').get('trips');

  assert.equal(relationship.key, 'trips', 'has relationship with trip');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});

test('should have fixtures', function(assert) {
  assert.ok(
    Ember.get(this.store().modelFor('video'), 'FIXTURES').length > 0,
    'should have fixtures'
  );
});
