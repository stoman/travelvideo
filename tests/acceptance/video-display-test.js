import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'travelvideo/tests/helpers';

module('Acceptance | video display', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /video/munich_airport', async function (assert) {
    await visit('/video/munich_airport');

    assert.strictEqual(currentURL(), '/video/munich_airport');
    // Verify that actual video data was loaded by checking for the video name
    assert.dom('h2').includesText('München Flughafen');
    // Verify that the date is correctly formatted
    assert.dom('[data-test-video-date]').hasText('15.08.2013');
  });
});
