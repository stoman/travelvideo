import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | trip', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('trip', {});
    assert.ok(model);
  });

  test('should have some videos', function (assert) {
    const store = this.owner.lookup('service:store');
    const Trip = store.modelFor('trip');
    const relationship = Trip.relationshipsByName.get('videos');

    assert.strictEqual(relationship.key, 'videos', 'has relationship with video');
    assert.strictEqual(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
  });

  test('should have fixtures', function (assert) {
    const store = this.owner.lookup('service:store');
    const Trip = store.modelFor('trip');
    assert.ok(
      Trip.FIXTURES.length > 0,
      'should have fixtures',
    );
  });
});
