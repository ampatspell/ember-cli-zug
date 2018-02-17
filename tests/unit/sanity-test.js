import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection, waitForCollectionSize } from '../helpers/runloop';
import { run } from '@ember/runloop';
import firebase from 'firebase';

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
  let cancel = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => run(() => {
    let { fromCache, hasPendingWrites } = snapshot.metadata;
    if(!fromCache && hasPendingWrites) {
      return;
    }
    info.push({ fromCache, hasPendingWrites });
  }));

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

test('delete document', async function(assert) {
  await this.recreate();

  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let doc = coll.doc();

  let info = [];
  let cancel = doc.onSnapshot({ includeMetadataChanges: true }, snapshot => run(() => {
    let { fromCache, hasPendingWrites } = snapshot.metadata;
    if(!fromCache && hasPendingWrites) {
      return;
    }
    let { exists } = snapshot;
    info.push({ fromCache, hasPendingWrites, exists });
  }));

  await doc.set({ name: 'Yellow Duck' });

  await waitForCollectionSize(coll, 1);

  await doc.delete();

  await waitForCollectionSize(coll, 0);

  assert.deepEqual(info, [
    {
      "exists": true,
      "fromCache": true,
      "hasPendingWrites": true
    },
    {
      "exists": true,
      "fromCache": false,
      "hasPendingWrites": false
    },
    {
      "exists": false,
      "fromCache": false,
      "hasPendingWrites": false
    }
  ]);

  cancel();
});

test('save with timestamp', async function(assert) {
  await this.recreate();

  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let ref = coll.doc('yellow');

  let info = [];
  let cancel = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => run(() => {
    let { fromCache, hasPendingWrites } = snapshot.metadata;
    let data = snapshot.data();
    if(!fromCache && hasPendingWrites) {
      return;
    }
    info.push({ fromCache, hasPendingWrites, data });
  }));

  await ref.set({ name: 'Yellow Duck', now: firebase.firestore.FieldValue.serverTimestamp() });

  await waitForCollectionSize(coll, 1);

  assert.ok(true);
  cancel();

  assert.ok(info[1].data.now);

  assert.deepEqual(info, [
    {
      "data": {
        "name": "Yellow Duck",
        "now": null
      },
      "fromCache": true,
      "hasPendingWrites": true
    },
    {
      "data": {
        "name": "Yellow Duck",
        "now": info[1].data.now
      },
      "fromCache": false,
      "hasPendingWrites": false
    }
  ]);
});

test.only('server timestamp estimate', async function(assert) {
  await this.recreate();

  let firestore = this.firestore;
  let coll = firestore.collection('ducks');
  let ref = coll.doc('yellow');

  let info = [];

  let cancel = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => run(() => {
    let { fromCache, hasPendingWrites } = snapshot.metadata;
    let data = snapshot.data({ serverTimestamps: 'estimate' });
    if(!fromCache && hasPendingWrites) {
      return;
    }
    info.push({ fromCache, hasPendingWrites, data });
  }));

  await ref.set({ name: 'Yellow Duck', now: firebase.firestore.FieldValue.serverTimestamp() });

  await waitForCollectionSize(coll, 1);

  assert.ok(true);
  cancel();

  let estimate = info[0].data.now;
  let actual = info[1].data.now;

  assert.ok(estimate);
  assert.ok(actual);
  assert.ok(estimate !== actual);

  assert.deepEqual(info, [
    {
      "data": {
        "name": "Yellow Duck",
        "now": estimate
      },
      "fromCache": true,
      "hasPendingWrites": true
    },
    {
      "data": {
        "name": "Yellow Duck",
        "now": actual
      },
      "fromCache": false,
      "hasPendingWrites": false
    }
  ]);
});
