import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('video-listing', 'Integration | Component | video listing', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{video-listing}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#video-listing}}
      template block text
    {{/video-listing}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it displays a video', function(assert) {
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
  this.render(hbs`{{video-listing video=video}}`);

  //check that all important properties are displayed
  assert.ok(
    this.$().text().indexOf(data.name) !== -1,
    'should render video name'
  );
  assert.ok(
    this.$().text().indexOf(data.description) !== -1,
    'should render video description'
  );
  assert.ok(
    this.$().text().indexOf(data.country) !== -1,
    'should render video country'
  );
  assert.ok(
    this.$('video').length > 0,
    'should render a video tag'
  );
  assert.ok(
    this.$().text().indexOf(data.guests) !== -1,
    'should render video guests'
  );
  assert.ok(
    this.$().text().indexOf(data.camera) !== -1,
    'should render video camera'
  );
});
