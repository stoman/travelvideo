import { findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | about', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /about', async function(assert) {
    await visit('/about');

    assert.equal(currentURL(), '/about');
  });

  test('about text shows actual content', async function(assert) {
    await visit('/about');

    assert.equal(findAll('.about').length, 1, 'about text should be visible');
    assert.equal(findAll('.about img').length, 1, 'image should be visible');
    assert.equal(findAll('.about a[href="https://github.com/stoman/travelvideo"]').length, 1, 'link to GitHub should be visible');
    assert.equal(findAll('.about a[href="https://www.facebook.com/stefan.toman"]').length, 1, 'link to Facebook should be visible');
  });
});

