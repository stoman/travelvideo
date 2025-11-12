import { test } from 'qunit';
import moduleForAcceptance from 'travelvideo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | open layers');

test('checking whether the map was loaded', function (assert) {
  visit('/');

  andThen(function () {
    assert.ok(
      find('#map .ol-viewport').length,
      'should have created a viewport',
    );
    assert.equal(
      find('#map .ol-control').length,
      0,
      'map should not have controls',
    );
  });
});

test('checking markers', function (assert) {
  visit('/');

  andThen(function () {
    assert.ok(find('#map .marker').length, 'should have created some markers');
  });
});
