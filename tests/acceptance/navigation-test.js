import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | navigation', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /, checking redirect', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/trip', 'should redirect to trip');
  });

  test('front page should link to the about page', async function(assert) {
    await visit('/');
    await click('a:contains("about")');
    assert.equal(currentURL(), '/about', 'should navigate to about');
  });

  test('front page should link to trip overview', async function(assert) {
    await visit('/');
    await click('a:contains("trip")');
    assert.equal(currentURL(), '/trip', 'should navigate to trips');
  });
});
