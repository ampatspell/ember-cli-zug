import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import Model from 'models/model';

const Duck = Model.extend();

module('model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.create = name => this.store._internal.models.createModel(name);
  }
});

test('create model', function(assert) {
  let model = this.create('duck');
  assert.ok(model);
  assert.ok(model._internal);
  assert.ok(Duck.detectInstance(model));
});
