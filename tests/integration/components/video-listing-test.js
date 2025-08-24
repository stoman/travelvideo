import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | video listing', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{video-listing}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#video-listing}}
        template block text
      {{/video-listing}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it displays a video', async function(assert) {
    //create fake video
    let data = {
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
      camera: 'testcamera'
    };
    this.set('video', data);

    //render component
    await render(hbs`{{video-listing video=video}}`);

    //check that all important properties are displayed
    assert.ok(
      this.element.textContent.indexOf(data.name) !== -1,
      'should render video name'
    );
    assert.ok(
      this.element.textContent.indexOf(data.description) !== -1,
      'should render video description'
    );
    assert.ok(
      this.element.textContent.indexOf(data.country) !== -1,
      'should render video country'
    );
    assert.ok(
      findAll('video').length > 0,
      'should render a video tag'
    );
    assert.ok(
      this.element.textContent.indexOf(data.guests) !== -1,
      'should render video guests'
    );
    assert.ok(
      this.element.textContent.indexOf(data.camera) !== -1,
      'should render video camera'
    );
  });
});
