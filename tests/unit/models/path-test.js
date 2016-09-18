/* globals Ember */

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('path', 'Unit | Model | path', {
  needs: ['model:video']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('should have some videos', function(assert) {
  const Path = this.store().modelFor('path');
  const relationship = Ember.get(Path, 'relationshipsByName').get('videos');

  assert.equal(relationship.key, 'videos', 'has relationship with video');
  assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});

test('should have fixtures', function(assert) {
  assert.ok(
    Ember.get(this.store().modelFor('path'), 'FIXTURES').length > 0,
    'should have fixtures'
  );
});
