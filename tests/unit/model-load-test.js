import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { recreateCollection } from '../helpers/runloop';

const Duck = PersistedModel.extend();

module('model-load', {
  async beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      { __name__: 'yellow', name: 'yellow' }
    ]);
    this.register('model:duck', Duck);
    this.modelNameForDocument = () => 'duck';
  }
});

test('load without opts', async function(assert) {
  try {
    this.store.load();
  } catch(err) {
    assert.equal(err.message, 'Assertion Failed: options must build query');
  }
});

test('load model with path', async function(assert) {
  await this.recreate();

  let model = await this.store.load({ path: 'ducks/yellow' });
  assert.equal(model.get('doc.path'), 'ducks/yellow');
});

test('load collection with path', async function(assert) {
  await this.recreate();

  let array = await this.store.load({ path: 'ducks' });
  assert.deepEqual(array.mapBy('doc.path'), [ 'ducks/yellow' ]);
});

test('load collection with collection', async function(assert) {
  await this.recreate();

  let array = await this.store.load({ collection: 'ducks' });
  assert.deepEqual(array.mapBy('doc.path'), [ 'ducks/yellow' ]);
});

test('load model with collection path and query', async function(assert) {
  await this.recreate();

  let model = await this.store.load({ path: 'ducks', query: coll => coll.doc('yellow') });
  assert.equal(model.get('doc.path'), 'ducks/yellow');
});

test('first model from doc ref', async function(assert) {
  await this.recreate();

  let model = await this.store.first({ path: 'ducks/yellow' });
  assert.equal(model.get('doc.path'), 'ducks/yellow');
});

test('first missing model from doc ref', async function(assert) {
  try {
    await this.store.first({ path: 'ducks/green' });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.equal(err.message, 'document: missing');
  }
});

test('first missing model from doc ref optional', async function(assert) {
  let model = await this.store.first({ path: 'ducks/green', optional: true });
  assert.equal(model.get('doc.path'), 'ducks/green');
  assert.equal(model.get('doc.isExisting'), false);
});

test('first missing model from query', async function(assert) {
  try {
    await this.store.first({ collection: 'ducks', query: q => q.where('name', '==', 'green') });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.equal(err.message, 'document: missing');
  }
});

test('first model from collection', async function(assert) {
  await this.recreate();

  let model = await this.store.first({ collection: 'ducks' });
  assert.equal(model.get('doc.path'), 'ducks/yellow');
});

test('settle', async function(assert) {
  await this.recreate();

  let resolved = false;
  this.store.load({ path: 'ducks/yellow' }).then(() => {
    resolved = true;
  });

  await this.store.settle();

  assert.ok(resolved);
});
