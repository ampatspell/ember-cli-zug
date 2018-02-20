import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import TransientModel from 'models/model/transient';
import InternalTransientModel from 'models/-private/model/internal-transient-model';
import { run } from '@ember/runloop';

const Duck = TransientModel.extend();

module('transient-model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.identity = this.store._internal.identity.models.storage;
    this.create = opts => this.store._internal.modelsManager.createNewInternalModel(opts);
  }
});

test('create model', function(assert) {
  let model = this.store.model({ name: 'duck', data: { ok: true } });
  assert.ok(model);
  assert.ok(model._internal);
  assert.ok(model._internal instanceof InternalTransientModel);
  assert.ok(Duck.detectInstance(model));
  assert.ok(model.get('ok'));
});

test.skip('create model with the same id throws', async function(assert) {
  this.store.model({ name: 'duck', id: 'thing', data: { ok: true } });
  try {
    this.store.model({ name: 'duck', id: 'thing', data: { ok: true } });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {});
  }
});

test('model is registered in identity and all are destroyed on context destroy', function(assert) {
  let internal = this.create({ name: 'duck' });
  assert.ok(this.identity.all.includes(internal));

  let model = internal.model(true);

  run(() => this.store.destroy());

  assert.ok(model.isDestroyed);
  assert.ok(internal.isDestroyed);
});

test('model is registered in identity and removed on destroy', function(assert) {
  let internal = this.create({ name: 'duck' });
  let model = internal.model(true);

  assert.ok(this.identity.all.includes(internal));

  run(() => model.destroy());

  assert.ok(!this.identity.all.includes(internal));
});
