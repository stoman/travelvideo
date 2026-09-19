import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate } from './format.ts';

test('renders an ISO date as European DD.MM.YYYY', () => {
  assert.equal(formatDate('2017-09-19'), '19.09.2017');
});

test('pads neither day nor month -- the source data always carries two digits', () => {
  assert.equal(formatDate('2014-01-05'), '05.01.2014');
});
