import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:map', 'Unit | Controller | map', {
  needs: [
    'service:metrics',
  ]
});

test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('hint visible by default', function(assert) {
  let controller = this.subject();
  assert.equal(controller.get('hintVisible'), true);
});

test('hint can be hidden by action hideHint', function(assert) {
  let controller = this.subject();
  controller.send('hideHint');
  assert.equal(controller.get('hintVisible'), false);
});
