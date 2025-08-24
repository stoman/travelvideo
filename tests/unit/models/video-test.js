/* globals Ember */

import { get } from '@ember/object';

import { module, test } from 'qunit';

import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | video', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('video'));
    // let store = this.store();
    assert.ok(!!model);
  });

  test('should have trips', function(assert) {
    const Video = this.owner.lookup('service:store').modelFor('video');
    const relationship = get(Video, 'relationshipsByName').get('trips');

    assert.equal(relationship.key, 'trips', 'has relationship with trip');
    assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
  });

  test('should have fixtures', function(assert) {
    assert.ok(
      get(this.owner.lookup('service:store').modelFor('video'), 'FIXTURES').length > 0,
      'should have fixtures'
    );
  });
});
