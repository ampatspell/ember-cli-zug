import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import Model from 'models/model';
import { run } from '@ember/runloop';

const Duck = Model.extend();

module('model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.identity = this.store._internal.identity.models;
    this.create = name => this.store._internal.models.createModel(name);
  }
});

test('create model', function(assert) {
  let model = this.create('duck');
  assert.ok(model);
  assert.ok(model._internal);
  assert.ok(Duck.detectInstance(model));
});

test('model is registered in context', function(assert) {
  let model = this.create('duck');
  assert.ok(this.identity._storage.all.includes(model._internal));

  run(() => this.store.destroy());

  assert.ok(model.isDestroying);
  assert.ok(model._internal.isDestroyed);
});
