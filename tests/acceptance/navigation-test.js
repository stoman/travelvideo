import { test } from 'qunit';
import moduleForAcceptance from 'travelvideo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | navigation');

test('visiting /, checking redirect', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/paths', 'should redirect to paths');
  });
});

test('front page should link to the about page', function (assert) {
  visit('/');
  click('a:contains("about")');
  andThen(function () {
    assert.equal(currentURL(), '/about', 'should navigate to about');
  });
});

test('front page should link to path overview', function (assert) {
  visit('/');
  click('a:contains("paths")');
  andThen(function () {
    assert.equal(currentURL(), '/paths', 'should navigate to paths');
  });
});
