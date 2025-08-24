import { findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | open layers', function(hooks) {
  setupApplicationTest(hooks);

  test('checking whether the map was loaded', async function(assert) {
    await visit('/');

    assert.ok(findAll('#map .ol-viewport').length, 'should have created a viewport');
    assert.equal(findAll('#map .ol-control').length, 0, 'map should not have controls');
  });

  test('checking markers', async function(assert) {
    await visit('/');

    assert.ok(findAll('#map .marker').length, 'should have created some markers');
  });
});
