import { test } from 'qunit';
import moduleForAcceptance from 'travelvideo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | about');

test('visiting /about', function (assert) {
  visit('/about');

  andThen(function () {
    assert.equal(currentURL(), '/about');
  });
});

test('about text shows actual content', function (assert) {
  visit('/about');

  andThen(function () {
    assert.equal(find('.about').length, 1, 'about text should be visible');
    assert.equal(find('.about img').length, 1, 'image should be visible');
    assert.equal(
      find('.about a[href="https://github.com/stoman/travelvideo"]').length,
      1,
      'link to GitHub should be visible',
    );
    assert.equal(
      find('.about a[href="https://www.facebook.com/stefan.toman"]').length,
      1,
      'link to Facebook should be visible',
    );
  });
});
