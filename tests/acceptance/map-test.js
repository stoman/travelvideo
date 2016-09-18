import { test } from 'qunit';
import moduleForAcceptance from 'travelvideo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | map');

test('visiting /map', function(assert) {
  visit('/map');

  andThen(function() {
    assert.equal(currentURL(), '/map');
  });
});

test('map should display hint', function(assert) {
  visit('/map');

  andThen(function() {
    assert.equal(find('.map-hint').length, 1, 'hint should be visible');
  });

  //navigate around
  visit('/');
  visit('/map');

  andThen(function() {
    assert.equal(find('.map-hint').length, 1, 'hint should stay visible after navigation');
  });
});

test('map hint can be hidden', function(assert) {
  visit('/map');

  //click the hide button
  click('.map-hint a:contains("x")');

  andThen(function() {
    assert.equal(find('.map-hint').length, 0, 'hint should not be visible');
  });

  //navigate around
  visit('/');
  visit('/map');

  andThen(function() {
    assert.equal(find('.map-hint').length, 0, 'hint should stay invisible after navigation');
  });
});
