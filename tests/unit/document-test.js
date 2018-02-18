import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection } from '../helpers/runloop';

module('document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
    this.create = props => this.store._internal.documents.createNewDocument(props);
  }
});

test('save document in collection', async function(assert) {
  await this.recreate();

  let doc = this.create({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  await doc.save();

  let ref = await this.coll.doc('yellow').get();

  assert.deepEqual(ref.data(), {
    "name": "Yellow"
  });
});

test('save document replaces reference', async function(assert) {
  await this.recreate();

  let doc = this.create({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let local = doc._internal._reference;

  await doc.save();

  let persisted = doc._internal._reference;

  assert.ok(local !== persisted);
  assert.ok(local.isDestroyed);

  let { id, path, collection } = persisted;

  assert.deepEqual({ id, path, collection }, {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });
});

test('save document notifies id, path change', async function(assert) {
  let doc = this.create({ collection: 'ducks', data: { name: 'Yellow' } });

  assert.ok(!doc.get('id'));
  assert.ok(!doc.get('path'));

  await doc.save();

  let id = doc.get('id');
  assert.equal(id.length, 20);
  assert.equal(doc.get('path'), `ducks/${id}`);
});

test('update document', async function(assert) {
  let ref;

  let doc = this.create({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  await doc.save();

  ref = await this.coll.doc('yellow').get();
  assert.deepEqual(ref.data(), {
    "name": "Yellow"
  });

  doc.set('data.email', 'yellow.duck@gmail.com');
  await doc.save();

  ref = await this.coll.doc('yellow').get();
  assert.deepEqual(ref.data(), {
    "email": "yellow.duck@gmail.com",
    "name": "Yellow"
  });
});
