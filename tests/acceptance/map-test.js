import { click, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | map', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /map', async function(assert) {
    await visit('/map');

    assert.equal(currentURL(), '/map');
  });

  test('map should display hint', async function(assert) {
    await visit('/map');

    assert.equal(findAll('.map-hint').length, 1, 'hint should be visible');

    //navigate around
    await visit('/');
    await visit('/map');

    assert.equal(findAll('.map-hint').length, 1, 'hint should stay visible after navigation');
  });

  test('map hint can be hidden', async function(assert) {
    await visit('/map');

    //click the hide button
    await click('.map-hint a:contains("x")');

    assert.equal(findAll('.map-hint').length, 0, 'hint should not be visible');

    //navigate around
    await visit('/');
    await visit('/map');

    assert.equal(findAll('.map-hint').length, 0, 'hint should stay invisible after navigation');
  });

  test('map route should enable controls of map', async function(assert) {
    await visit('/map');

    assert.ok(findAll('.ol-control').length, 'map should have controls');
  });

  test('other routes should disable controls of map', async function(assert) {
    await visit('/');

    assert.equal(findAll('.ol-control').length, 0, 'map should not have controls');
  });
});
