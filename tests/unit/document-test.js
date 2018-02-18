import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection } from '../helpers/runloop';
import { all } from 'rsvp';

module('document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
    this.create = props => this.store._internal.documents.createNewDocument(props);
    this.load = opts => this.store._internal.documents.loadExistingDocument(opts);
    this.existing = opts => this.store._internal.documents.createExistingDocument(opts);
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

test('multiple parallel saves', async function(assert) {
  await this.recreate();

  let doc = this.create({ collection: 'ducks', data: { name: 'Yellow' } });

  await all([
    doc.save(),
    doc.save(),
    doc.save()
  ]);

  let snapshot = await this.coll.get();
  assert.equal(snapshot.size, 1);
});

test('load document', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  let doc = await this.load({ collection: 'ducks', id: 'yellow' });
  assert.ok(doc);

  assert.deepEqual(doc.get('serialized'), {
    "collection": "ducks",
    "id": "yellow",
    "path": "ducks/yellow",
    "exists": true,
    "data": {
      name: 'Yellow'
    }
  });
});

test('load document with settle', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  this.load({ collection: 'ducks', id: 'yellow' });

  await this.store.settle();

  let doc = this.existing({ collection: 'ducks', id: 'yellow' });

  assert.deepEqual(doc.get('serialized'), {
    "collection": "ducks",
    "id": "yellow",
    "path": "ducks/yellow",
    "exists": true,
    "data": {
      name: 'Yellow'
    }
  });
});

test('settle store', async function(assert) {
  await this.coll.doc('yellow').set({ name: 'Yellow' });
  let doc = this.existing({ collection: 'ducks', id: 'yellow' });

  doc.load();
  await this.store.settle();

  assert.deepEqual(doc.get('serialized'), {
    "id": "yellow",
    "collection": "ducks",
    "path": "ducks/yellow",
    "exists": true,
    "data": {
      "name": "Yellow"
    }
  });
});

test('load missing document', async function(assert) {
  await this.recreate();
  try {
    await this.load({ collection: 'ducks', id: 'yellow' });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      error: 'document',
      reason: 'missing'
    });
  }
});
