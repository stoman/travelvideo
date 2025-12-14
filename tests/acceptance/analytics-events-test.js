import { module, test } from 'qunit';
import {
  visit,
  click,
  triggerEvent,
  currentURL,
  settled,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';

module('Acceptance | analytics events', function (hooks) {
  setupApplicationTest(hooks);

  let trackedEvents;

  class MockMetrics extends Service {
    trackEvent(engine, options) {
      trackedEvents.push({ engine, options });
    }
    trackPage() {
      // For this test, we don't care about page tracking
    }
  }

  hooks.beforeEach(function () {
    trackedEvents = [];
    this.owner.register('service:metrics', MockMetrics);
  });

  test('visiting a trip and navigating', async function (assert) {
    await visit('/trip/start/interrail');

    // It should track the start of the trip
    assert.strictEqual(trackedEvents.length, 1, 'start event was tracked');
    assert.deepEqual(
      trackedEvents[0].options,
      {
        category: 'trip',
        action: 'start',
        label: 'interrail',
      },
      'start event has correct data',
    );

    // It should track the next video event
    await triggerEvent('video', 'ended');
    assert.strictEqual(trackedEvents.length, 2, 'next video event was tracked');
    assert.deepEqual(
      trackedEvents[1].options,
      {
        category: 'trip',
        action: 'nextVideo',
        label: 'interrail',
      },
      'next video event has correct data',
    );

    // It should track the stop event
    await click('button.stop-trip'); // Assuming there's a button with this class
    assert.strictEqual(trackedEvents.length, 3, 'stop event was tracked');
    assert.deepEqual(
      trackedEvents[2].options,
      {
        category: 'trip',
        action: 'stop',
        label: 'interrail',
      },
      'stop event has correct data',
    );
  });

  test('visiting a random video', async function (assert) {
    await visit('/random');
    await settled();

    const url = currentURL();
    const randomVideoId = url.split('/').pop();

    const randomVideoEvent = trackedEvents.find(
      (event) => event.options.action === 'view-random',
    );

    assert.ok(randomVideoEvent, 'random video event was tracked');

    assert.deepEqual(
      randomVideoEvent.options,
      {
        category: 'video',
        action: 'view-random',
        label: randomVideoId,
      },
      'random video event has correct data',
    );
  });
});
