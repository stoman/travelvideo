import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | open layers', function (hooks) {
  setupApplicationTest(hooks);

  test('checking whether the map was loaded', async function (assert) {
    await visit('/');

    assert.dom('#map .ol-viewport').exists('should have created a viewport');
    assert.dom('#map .ol-control').doesNotExist('map should not have controls');
  });

  test('checking markers', async function (assert) {
    await visit('/');

    assert.dom('#map .marker').exists('should have created some markers');
  });
});
