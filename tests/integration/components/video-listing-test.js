import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | video listing', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<VideoListing />`);

    assert.strictEqual(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <VideoListing>
        template block text
      </VideoListing>
    `);

    assert.strictEqual(this.element.textContent.trim(), 'template block text');
  });

  test('it displays a video', async function (assert) {
    //create fake video
    const data = {
      id: 'testid',
      name: 'testname',
      description: 'testdescription',
      country: 'testcountry',
      trip: 'trip.mp4',
      date: '2013-01-01',
      latitude: 3.14,
      longitude: -2.7,
      peopleIn: 'testera',
      peopleOut: 'testerb',
      guests: 'testerc',
      camera: 'testcamera',
    };
    this.set('video', data);

    //render component
    await render(hbs`<VideoListing @video={{this.video}} />`);

    //check that all important properties are displayed
    assert.dom().hasText(new RegExp(data.name), 'should render video name');
    assert
      .dom()
      .hasText(new RegExp(data.description), 'should render video description');
    assert
      .dom()
      .hasText(new RegExp(data.country), 'should render video country');
    assert.dom('video').exists('should render a video tag');
    assert.dom().hasText(new RegExp(data.guests), 'should render video guests');
    assert.dom().hasText(new RegExp(data.camera), 'should render video camera');
  });
});

module('Integration | Component | video listing | analytics', function (hooks) {
  setupRenderingTest(hooks);

  let trackedEvents;

  class MockMetrics extends Service {
    trackEvent(engine, options) {
      trackedEvents.push({ engine, options });
    }
  }

  hooks.beforeEach(function () {
    trackedEvents = [];
    // Register the stub as the 'metrics' service
    this.owner.register('service:metrics', MockMetrics);
  });

  test('it tracks play, pause, and ended events', async function (assert) {
    const data = {
      id: 'testid',
      name: 'testname',
      date: '2024-01-01',
    };
    this.set('video', data);

    await render(hbs`<VideoListing @video={{this.video}} />`);

    // test play event
    await triggerEvent('video', 'play');
    assert.strictEqual(trackedEvents.length, 1, 'play event was tracked');
    assert.deepEqual(
      trackedEvents[0].options,
      {
        category: 'video',
        action: 'play',
        label: 'testid',
      },
      'play event has correct data',
    );

    // test pause event
    await triggerEvent('video', 'pause');
    assert.strictEqual(trackedEvents.length, 2, 'pause event was tracked');
    assert.deepEqual(
      trackedEvents[1].options,
      {
        category: 'video',
        action: 'pause',
        label: 'testid',
      },
      'pause event has correct data',
    );

    // test ended event
    await triggerEvent('video', 'ended');
    assert.strictEqual(trackedEvents.length, 3, 'ended event was tracked');
    assert.deepEqual(
      trackedEvents[2].options,
      {
        category: 'video',
        action: 'end',
        label: 'testid',
      },
      'ended event has correct data',
    );
  });
});
