import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | random', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /random redirects to a random video', async function (assert) {
    await visit('/random');

    assert.notEqual(
      currentURL(),
      '/random',
      'should redirect to a random video',
    );
    assert.ok(
      currentURL().startsWith('/random/'),
      'should redirect to a url like /random/{videoId}',
    );
  });
});
