import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'travelvideo/tests/helpers';

module('Acceptance | trip overview', function (hooks) {
    setupApplicationTest(hooks);

    test('visiting /trip/interrail', async function (assert) {
        await visit('/trip/interrail');

        assert.strictEqual(currentURL(), '/trip/interrail');
        assert.dom('h2').includesText('Interrail'); // Assuming the trip name is displayed in h2
    });
});
