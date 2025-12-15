import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

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

  test('it calls onEnd when the video ends', async function (assert) {
    assert.expect(1);

    // TDD: test-driven development
    // 1. Arrange
    this.set('video', { filename: 'test.mp4' });
    this.set('onEnd', () => {
      // 3. Assert
      assert.ok(true, 'onEnd was called');
    });

    // 2. Act
    await render(
      hbs`<VideoListing @video={{this.video}} @onEnd={{this.onEnd}} />`,
    );
    await triggerEvent('video', 'ended');
  });
});
