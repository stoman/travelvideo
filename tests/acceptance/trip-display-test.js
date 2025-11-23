import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'travelvideo/tests/helpers';

module('Acceptance | trip display', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /trip/interrail/munich_airport', async function (assert) {
    await visit('/trip/interrail/munich_airport');

    assert.strictEqual(currentURL(), '/trip/interrail/munich_airport');
    // Verify that actual video data was loaded by checking for the video name
    assert.dom('h2').includesText('München Flughafen');
  });
});
