import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import InternalPersistedModel from 'models/-private/model/internal-persisted-model';

const Duck = PersistedModel.extend();

module('persisted-model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.identity = this.store._internal.identity.models;
    this.create = name => this.store._internal.models.createModel(name);
  }
});

test('create model creates persisted model', function(assert) {
  let model = this.create('duck');
  assert.ok(model);
  assert.ok(model._internal instanceof InternalPersistedModel);
  assert.ok(Duck.detectInstance(model));
});

test('model has doc', function(assert) {
  let model = this.create('duck');
  assert.ok(model.get('doc'));
});
