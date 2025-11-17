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
    // Find the about link in the menu by its text content
    const aboutLink = [...document.querySelectorAll('#menu a')].find(
      (el) => el.textContent.trim() === 'about',
    );
    await click(aboutLink);
    assert.strictEqual(currentURL(), '/about', 'should navigate to about');
  });

  test('front page should link to trip overview', async function (assert) {
    await visit('/');
    // Find the trips link in the menu by its text content
    const tripsLink = [...document.querySelectorAll('#menu a')].find(
      (el) => el.textContent.trim() === 'trips',
    );
    await click(tripsLink);
    assert.strictEqual(currentURL(), '/trip', 'should navigate to trips');
  });
});
