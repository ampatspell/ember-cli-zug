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
    this.existing = opts => this.store._internal.modelsManager.existingInternalModel(opts);
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

test('create model with props and path', function(assert) {
  let model = this.store.model({ name: 'duck', path: 'thing', data: { ok: true, message: 'hey there' } });

  assert.equal(model.get('ok'), true);
  assert.equal(model.get('message'), 'hey there');
  assert.equal(model.get('path'), 'thing');

  assert.ok(this.store.existing({ name: 'duck', path: 'thing' }) === model);
});

test('create model with the same path throws', async function(assert) {
  this.store.model({ name: 'duck', path: 'thing', data: { ok: true } });
  try {
    this.store.model({ name: 'duck', path: 'thing', data: { ok: true } });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.equal(err.message, `Assertion Failed: transient model with path 'thing' is already registered`);
  }
});

test('model is registered in identity and all are destroyed on context destroy', function(assert) {
  let internal = this.create({ name: 'duck' });
  assert.ok(this.identity.all.includes(internal));

  let model = internal.model(true);

  run(() => this.store.destroy());

  assert.ok(!this.identity.all.includes(internal));

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

test('created model with path is added to identity', function(assert) {
  let internal = this.create({ name: 'duck', path: 'ducks/hello' });

  assert.ok(this.identity.all.includes(internal));
  assert.ok(this.identity.ref['ducks/hello'] === internal);

  run(() => this.store.destroy());

  assert.ok(!this.identity.all.includes(internal));
  assert.ok(this.identity.ref['ducks/hello'] === undefined);
});

test('model with id is created with existing, later on retrieved', function(assert) {
  let first = this.existing({ name: 'duck', id: 'one', collection: 'ducks', create: true });
  let second = this.existing({ name: 'duck', id: 'one', collection: 'ducks', create: true });
  assert.ok(first === second);
});

test('path is read only', function(assert) {
  let internal = this.create({ name: 'duck', path: 'ducks/hello' });
  let model = internal.model(true);
  assert.equal(model.get('path'), 'ducks/hello');
  try {
    model.set('path', 'foobar');
  } catch(err) {
    assert.ok(err.message.includes('Cannot set read-only property "path"'));
  }
  assert.equal(model.get('path'), 'ducks/hello');
});
