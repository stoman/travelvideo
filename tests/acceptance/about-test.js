import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | about', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /about', async function (assert) {
    await visit('/about');
    assert.strictEqual(currentURL(), '/about');
  });

  test('about text shows actual content', async function (assert) {
    await visit('/about');

    assert
      .dom('.about')
      .exists({ count: 1 }, 'about text should be visible');
    assert
      .dom('.about img')
      .exists({ count: 1 }, 'image should be visible');
    assert
      .dom('.about a[href="https://github.com/stoman/travelvideo"]')
      .exists({ count: 1 }, 'link to GitHub should be visible');
    assert
      .dom('.about a[href="https://www.facebook.com/stefan.toman"]')
      .exists({ count: 1 }, 'link to Facebook should be visible');
  });
});
