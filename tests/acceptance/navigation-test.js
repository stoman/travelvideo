import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | navigation', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /, checking redirect', async function (assert) {
    await visit('/');
    assert.strictEqual(currentURL(), '/trip', 'should redirect to trip');
  });

  test('front page should link to the about page', async function (assert) {
    await visit('/');
    await click('a:contains("about")');
    assert.strictEqual(currentURL(), '/about', 'should navigate to about');
  });

  test('front page should link to trip overview', async function (assert) {
    await visit('/');
    await click('a:contains("trip")');
    assert.strictEqual(currentURL(), '/trip', 'should navigate to trips');
  });
});
