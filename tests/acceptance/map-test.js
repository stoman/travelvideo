import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | map', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /map', async function (assert) {
    await visit('/map');
    assert.strictEqual(currentURL(), '/map');
  });

  test('map should display hint', async function (assert) {
    await visit('/map');
    assert.dom('.map-hint').exists({ count: 1 }, 'hint should be visible');

    //navigate around
    await visit('/');
    await visit('/map');

    assert
      .dom('.map-hint')
      .exists({ count: 1 }, 'hint should stay visible after navigation');
  });

  test('map hint can be hidden', async function (assert) {
    await visit('/map');

    //click the hide button
    await click('.map-hint button');

    assert.dom('.map-hint').doesNotExist('hint should not be visible');

    //navigate around
    await visit('/');
    await visit('/map');

    assert
      .dom('.map-hint')
      .doesNotExist('hint should stay invisible after navigation');
  });

  test('map route should enable controls of map', async function (assert) {
    await visit('/map');
    assert.dom('.ol-control').exists('map should have controls');
  });

  test('other routes should disable controls of map', async function (assert) {
    await visit('/');
    assert.dom('.ol-control').doesNotExist('map should not have controls');
  });
});
