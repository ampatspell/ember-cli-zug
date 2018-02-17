import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection, waitForCollectionSize } from '../helpers/runloop';

module('sanity', {
  beforeEach() {
    this.recreate = () => recreateCollection(this.firestore.collection('ducks'));
  }
});

test('hello', function(assert) {
  assert.ok(this.application);
  assert.ok(this.instance);
  assert.ok(this.store);
});

test('firebase is configured', function(assert) {
  let store = this.store;
  assert.ok(store.firebase);
  assert.ok(store.firestore);
});

test('firestore load', async function(assert) {
  let firestore = this.store.firestore;
  let result = await firestore.collection('non-existant').get();
  assert.ok(result);
  assert.ok(result.docs);
  assert.equal(result.size, 0);
});

test('create document with id', async function(assert) {
  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let ref = coll.doc('yellow');
  await ref.set({ name: 'Yellow Duck' });
  assert.equal(ref.path, 'ducks/yellow');
});

test('overwrite document', async function(assert) {
  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  await coll.doc('yellow').set({ name: 'Yellow Duck' });
  await coll.doc('yellow').set({ email: 'duck@gmail.com' });
  let doc = await coll.doc('yellow').get();
  assert.deepEqual(doc.data(), {
    "email": "duck@gmail.com"
  });
});

test('add document with generated id', async function(assert) {
  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let ref = await coll.add({ name: 'Yellow Duck' });
  assert.equal(ref.id.length, 20);
  assert.equal(ref.path, `ducks/${ref.id}`);
});

test('create document ref with generated id', async function(assert) {
  await this.recreate();

  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let ref = coll.doc();
  assert.equal(ref.id.length, 20);
  assert.equal(ref.path, `ducks/${ref.id}`);

  let info = [];
  let cancel = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => {
    let { fromCache, hasPendingWrites } = snapshot.metadata;
    info.push({ fromCache, hasPendingWrites });
  });

  await ref.set({ name: 'Yellow Duck' });

  await waitForCollectionSize(coll, 1);

  assert.deepEqual(info, [
    {
      "fromCache": true,
      "hasPendingWrites": true
    },
    {
      "fromCache": false,
      "hasPendingWrites": false
    }
  ]);

  cancel();
});
