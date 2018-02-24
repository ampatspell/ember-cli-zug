import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { run } from '@ember/runloop';

const Duck = PersistedModel.extend();

module('identity', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.identity = this.store.get('identity');
  }
});

test('identity exists', function(assert) {
  assert.ok(this.identity);
});

test('new model is added and removed from identity', function(assert) {
  let model = this.store.model({ name: 'duck' });

  assert.ok(model);
  assert.ok(this.identity.includes(model));

  run(() => model.destroy());

  assert.ok(!this.identity.includes(model));
});
