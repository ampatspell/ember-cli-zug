import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import InternalPersistedModel from 'models/-private/model/internal-persisted-model';
import { recreateCollection } from '../helpers/runloop';

const Duck = PersistedModel.extend();

module('persisted-model', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      { __name__: 'yellow', name: 'yellow' }
    ]);
    this.register('model:duck', Duck);
    this.identity = this.store._internal.identity.models;
    this.create = name => this.store._internal.models.createModel(name);
  }
});

test.skip('create model creates persisted model', function(assert) {
  let model = this.create('duck');
  assert.ok(model);
  assert.ok(model._internal instanceof InternalPersistedModel);
  assert.ok(Duck.detectInstance(model));
});

test.skip('model has doc', function(assert) {
  let model = this.create('duck');
  assert.ok(model.get('doc'));
});

test.skip('load model with path', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'yellow' });

  let model = await this.store.first({ id: 'yellow', collection: 'ducks' });
  assert.ok(model);
});

test.skip('load model with ref', async function(assert) {
  await this.recreate();
  let model = await this.store.first(db => db.collection('ducks').doc('yellow'));
  assert.ok(model);
});

test.skip('load model with collection ref', async function(assert) {
  await this.recreate();
  let model = await this.store.first(db => db.collection('ducks'));
  assert.ok(model);
});

test.skip('load model with query', async function(assert) {
  await this.recreate();
  let model = await this.store.first(db => db.collection('ducks').where('__name__', '==', 'yellow'));
  assert.ok(model);
});
