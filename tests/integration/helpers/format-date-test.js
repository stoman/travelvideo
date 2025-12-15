import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format-date', function (hooks) {
  setupRenderingTest(hooks);

  test('it formats a date object', async function (assert) {
    this.set('testDate', new Date('2024-05-23T12:00:00Z'));

    await render(hbs`{{format-date this.testDate}}`);

    assert.dom(this.element).hasText('23.05.2024');
  });

  test('it returns an empty string for non-date inputs', async function (assert) {
    this.set('testDate', 'not a date');

    await render(hbs`{{format-date this.testDate}}`);

    assert.dom(this.element).hasText('');
  });

  test('it handles single-digit day and month', async function (assert) {
    this.set('testDate', new Date('2024-01-05T12:00:00Z'));

    await render(hbs`{{format-date this.testDate}}`);

    assert.dom(this.element).hasText('05.01.2024');
  });
});
