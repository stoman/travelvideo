import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | video', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('video', {});
    assert.ok(model);
  });

  test('should have trips', function (assert) {
    const store = this.owner.lookup('service:store');
    const Video = store.modelFor('video');
    const relationship = Video.relationshipsByName.get('trips');

    assert.strictEqual(relationship.key, 'trips', 'has relationship with trip');
    assert.strictEqual(
      relationship.kind,
      'hasMany',
      'kind of relationship is hasMany',
    );
  });

  test('should have fixtures', function (assert) {
    const store = this.owner.lookup('service:store');
    const Video = store.modelFor('video');
    assert.ok(Video.FIXTURES.length > 0, 'should have fixtures');
  });
});
