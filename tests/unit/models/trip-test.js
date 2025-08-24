/* globals Ember */

import { get } from '@ember/object';

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('trip', 'Unit | Model | trip', {
  needs: ['model:video']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should have some videos', function(assert) {
  const Trip = this.store().modelFor('trip');
  const relationship = get(Trip, 'relationshipsByName').get('videos');

  assert.equal(relationship.key, 'videos', 'has relationship with video');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});

test('should have fixtures', function(assert) {
  assert.ok(
    get(this.store().modelFor('trip'), 'FIXTURES').length > 0,
    'should have fixtures'
  );
});
