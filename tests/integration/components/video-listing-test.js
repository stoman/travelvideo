import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | video listing', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{video-listing}}`);

    assert.strictEqual(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#video-listing}}
        template block text
      {{/video-listing}}
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
    await render(hbs`{{video-listing video=video}}`);

    //check that all important properties are displayed
    assert
      .dom()
      .hasText(
        new RegExp(data.name),
        'should render video name',
      );
    assert
      .dom()
      .hasText(
        new RegExp(data.description),
        'should render video description',
      );
    assert
      .dom()
      .hasText(
        new RegExp(data.country),
        'should render video country',
      );
    assert.dom('video').exists('should render a video tag');
    assert
      .dom()
      .hasText(
        new RegExp(data.guests),
        'should render video guests',
      );
    assert
      .dom()
      .hasText(
        new RegExp(data.camera),
        'should render video camera',
      );
  });
});
