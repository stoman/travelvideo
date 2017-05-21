import { test } from 'qunit';
import moduleForAcceptance from 'travelvideo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | navigation');

test('visiting /, checking redirect', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/trip', 'should redirect to trip');
  });
});

test('front page should link to the about page', function (assert) {
  visit('/');
  click('a:contains("about")');
  andThen(function () {
    assert.equal(currentURL(), '/about', 'should navigate to about');
  });
});

test('front page should link to trip overview', function (assert) {
  visit('/');
  click('a:contains("trip")');
  andThen(function () {
    assert.equal(currentURL(), '/trip', 'should navigate to trips');
  });
});
