import { module, test } from 'qunit';
import { visit, currentURL, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'travelvideo/tests/helpers';

module('Acceptance | trips', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /trip shows video names', async function (assert) {
    await visit('/trip');

    assert.strictEqual(currentURL(), '/trip');

    const tripLinks = findAll('.box p');
    assert.ok(tripLinks.length > 0, 'Trips are displayed');

    // Check the first trip (All Videos) or any trip that has videos
    // The template renders: {{trip.name}} {{trip.year}} ({{video.name}} ...)
    // We want to make sure the text inside () is not empty or just whitespace/commas if there are videos

    // Let's check specifically for "Interrail" trip which has videos
    // We can look for the text content

    const pageText = document.body.textContent;
    assert.ok(pageText.includes('Interrail'), 'Interrail trip is shown');

    // Check if video names are present. "munich_airport" is in Interrail.
    assert.ok(
      pageText.includes('München Flughafen'),
      'Video name München Flughafen should be visible',
    );
  });
});
