import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'travelvideo/tests/helpers';

module('Acceptance | trip overview', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /trip/interrail', async function (assert) {
    await visit('/trip/interrail');

    assert.strictEqual(currentURL(), '/trip/interrail');
    // Verify that actual trip data was loaded by checking for the year, not just the trip id
    assert.dom('h2').includesText('2013');
  });
});
