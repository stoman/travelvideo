/* globals Ember */

import { get } from '@ember/object';

import { module, test } from 'qunit';

import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | trip', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('trip'));
    // let store = this.store();
    assert.ok(!!model);
  });

  test('should have some videos', function(assert) {
    const Trip = this.owner.lookup('service:store').modelFor('trip');
    const relationship = get(Trip, 'relationshipsByName').get('videos');

    assert.equal(relationship.key, 'videos', 'has relationship with video');
    assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
  });

  test('should have fixtures', function(assert) {
    assert.ok(
      get(this.owner.lookup('service:store').modelFor('trip'), 'FIXTURES').length > 0,
      'should have fixtures'
    );
  });
});
