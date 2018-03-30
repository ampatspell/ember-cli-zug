import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection, waitForCollectionSize, wait, waitForProp } from '../helpers/runloop';
import { all } from 'rsvp';
import { typeOf } from '@ember/utils';
import { serverTimestamp } from 'ember-cli-zug/utils';

module('document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
    this.identity = this.store._internal.identity.documents.storage;
    this.local = opts => this.store._internal.documentsManager.createNewInternalDocument(opts);
    this.existing = opts => this.store._internal.documentsManager.existingInternalDocument(opts);
  }
});

test('save local document', async function(assert) {
  await this.recreate();

  assert.ok(!this.existing({ id: 'yellow', collection: 'ducks' }));

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let model = doc.model(true);

  assert.ok(model);

  assert.deepEqual(model.get('serialized'), {
    "ref": {
      "id": "yellow",
      "collection": "ducks",
      "path": "ducks/yellow"
    },
    "state": {
      "isNew": true,
      "isLoading": false,
      "isLoaded": true,
      "isDirty": true,
      "isSaving": false,
      "isExisting": undefined,
      "isError": false,
      "error": null
    },
    "data": {
      "name": "Yellow"
    }
  });

  assert.ok(!this.existing({ id: 'yellow', collection: 'ducks' }));

  assert.ok(doc);
  assert.ok(this.identity.all.includes(doc));
  assert.ok(this.identity.ref['ducks/yellow'] === undefined);

  await doc.save();

  assert.ok(this.identity.ref['ducks/yellow'] === doc);

  assert.ok(this.existing({ id: 'yellow', collection: 'ducks' }) === doc);

  let snapshot = await this.firestore.doc('ducks/yellow').get();
  assert.deepEqual(snapshot.data(), { "name": "Yellow" });

  assert.deepEqual(model.get('serialized'), {
    "ref": {
      "id": "yellow",
      "collection": "ducks",
      "path": "ducks/yellow"
    },
    "state": {
      "isNew": false,
      "isLoading": false,
      "isLoaded": true,
      "isDirty": false,
      "isSaving": false,
      "isExisting": true,
      "isError": false,
      "error": null
    },
    "data": {
      "name": "Yellow"
    }
  });
});

test('load with optional, wait for document to appear', async function(assert) {
  await this.recreate();

  let doc = this.existing({ id: 'yellow', collection: 'ducks', create: true });

  assert.deepEqual(doc.model(true).get('serialized.state'), {
    "error": null,
    "isDirty": false,
    "isError": false,
    "isExisting": undefined,
    "isNew": false,
    "isLoading": true,
    "isLoaded": false,
    "isSaving": false
  });

  await doc.load({ optional: true });

  assert.deepEqual(doc.model(true).get('serialized.state'), {
    "error": null,
    "isDirty": false,
    "isError": false,
    "isExisting": false,
    "isNew": false,
    "isLoading": false,
    "isLoaded": true,
    "isSaving": false
  });

  await this.firestore.doc('ducks/yellow').set({ name: 'Yellow' });
  await waitForCollectionSize(this.firestore.collection('ducks'), 1);

  assert.deepEqual(doc.model(true).get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": true,
      "isNew": false,
      "isLoading": false,
      "isLoaded": true,
      "isSaving": false
    }
  });
});

test('existing with create', async function(assert) {
  assert.ok(!this.existing({ id: 'yellow', collection: 'ducks' }));

  let doc = this.existing({ id: 'yellow', collection: 'ducks', create: true });

  let model = doc.model(true);
  assert.ok(model);

  assert.deepEqual(model.get('serialized'), {
    "ref": {
      "id": "yellow",
      "collection": "ducks",
      "path": "ducks/yellow"
    },
    "state": {
      "isLoading": true,
      "isNew": false,
      "isLoaded": false,
      "isDirty": false,
      "isSaving": false,
      "isExisting": undefined,
      "isError": false,
      "error": null
    },
    "data": {}
  });

  model.set('data.name', 'yellow');

  assert.deepEqual(model.get('serialized'), {
    "ref": {
      "id": "yellow",
      "collection": "ducks",
      "path": "ducks/yellow"
    },
    "state": {
      "isLoading": true,
      "isNew": false,
      "isLoaded": false,
      "isDirty": true,
      "isSaving": false,
      "isExisting": undefined,
      "isError": false,
      "error": null
    },
    "data": {
      "name": "yellow"
    }
  });

  assert.ok(doc);
  assert.ok(this.identity.all.includes(doc));
  assert.ok(this.identity.ref['ducks/yellow'] === doc);
});

test('existing model is removed from identity on destroy', function(assert) {
  let doc = this.existing({ id: 'yellow', collection: 'ducks', create: true });

  assert.ok(doc);
  assert.ok(this.identity.all.includes(doc));
  assert.ok(this.identity.ref['ducks/yellow'] === doc);

  doc.destroy();

  assert.ok(!this.identity.all.includes(doc));
  assert.ok(this.identity.ref['ducks/yellow'] === undefined);
});

test('save document in collection', async function(assert) {
  await this.recreate();

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  await doc.save();

  let ref = await this.coll.doc('yellow').get();

  assert.deepEqual(ref.data(), {
    "name": "Yellow"
  });
});

test('save document replaces reference', async function(assert) {
  await this.recreate();

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let local = doc._reference;

  await doc.save();

  let persisted = doc._reference;

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
  let doc = this.local({ collection: 'ducks', data: { name: 'Yellow' } });
  let model = doc.model(true);

  assert.ok(!model.get('id'));
  assert.ok(!model.get('path'));

  await doc.save();

  let id = model.get('id');
  assert.equal(id.length, 20);
  assert.equal(model.get('path'), `ducks/${id}`);
});

test('update document', async function(assert) {
  let ref;

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let model = doc.model(true);

  assert.deepEqual(model.get('serialized').state, {
    "error": null,
    "isLoading": false,
    "isLoaded": true,
    "isDirty": true,
    "isError": false,
    "isExisting": undefined,
    "isNew": true,
    "isSaving": false
  });

  let promise = doc.save();

  await wait();

  assert.deepEqual(model.get('serialized.state'), {
    "error": null,
    "isDirty": true,
    "isError": false,
    "isExisting": undefined,
    "isLoaded": true,
    "isLoading": false,
    "isNew": true,
    "isSaving": true
  });

  await promise;

  assert.deepEqual(model.get('serialized.state'), {
    "error": null,
    "isLoading": false,
    "isLoaded": true,
    "isDirty": false,
    "isError": false,
    "isExisting": true,
    "isNew": false,
    "isSaving": false
  });

  ref = await this.coll.doc('yellow').get();
  assert.deepEqual(ref.data(), {
    "name": "Yellow"
  });

  model.set('data.email', 'yellow.duck@gmail.com');

  assert.deepEqual(model.get('serialized').state, {
    "error": null,
    "isLoading": false,
    "isLoaded": true,
    "isDirty": true,
    "isError": false,
    "isExisting": true,
    "isNew": false,
    "isSaving": false
  });

  promise = model.save();

  await wait();

  assert.deepEqual(model.get('serialized.state'), {
    "error": null,
    "isDirty": true,
    "isError": false,
    "isExisting": true,
    "isLoaded": true,
    "isLoading": false,
    "isNew": false,
    "isSaving": true
  });

  await promise;

  ref = await this.coll.doc('yellow').get();
  assert.deepEqual(ref.data(), {
    "email": "yellow.duck@gmail.com",
    "name": "Yellow"
  });
});

test('multiple parallel saves', async function(assert) {
  await this.recreate();

  let doc = this.local({ collection: 'ducks', data: { name: 'Yellow' } });

  await all([
    doc.save(),
    doc.save(),
    doc.save()
  ]);

  let snapshot = await this.coll.get();
  assert.equal(snapshot.size, 1);
});

test('load document with settle', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);

  assert.deepEqual(model.get('serialized'), {
    "data": {},
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "isLoading": true,
      "isLoaded": false,
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": undefined,
      "isNew": false,
      "isSaving": false
    }
  });

  model.load();

  await this.store.settle();

  assert.deepEqual(model.get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "isLoading": false,
      "isLoaded": true,
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": true,
      "isNew": false,
      "isSaving": false
    }
  });
});

test('load document with stores.settle', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);

  model.load();

  await this.stores.settle();

  assert.deepEqual(model.get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "isLoading": false,
      "isLoaded": true,
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": true,
      "isNew": false,
      "isSaving": false
    }
  });
});

test('load missing document', async function(assert) {
  await this.recreate();
  try {
    await this.existing({ collection: 'ducks', id: 'yellow', create: true }).load();
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      error: 'document',
      reason: 'missing'
    });
  }
});

test('existing document is not dirty, not loaded', async function(assert) {
  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);
  assert.deepEqual(model.get('serialized.state'), {
    "isLoading": true,
    "error": null,
    "isDirty": false,
    "isError": false,
    "isExisting": undefined,
    "isNew": false,
    "isLoaded": false,
    "isSaving": false
  });
});

test('existing document after load is loaded', async function(assert) {
  await this.recreate();

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);

  await model.load({ optional: true });

  assert.deepEqual(model.get('serialized.state'), {
    "isLoading": false,
    "error": null,
    "isDirty": false,
    "isError": false,
    "isExisting": false,
    "isNew": false,
    "isLoaded": true,
    "isSaving": false
  });
});

test('document isLoading is true for created existing doc', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);

  assert.deepEqual(model.get('serialized.state'), {
    "error": null,
    "isDirty": false,
    "isError": false,
    "isExisting": undefined,
    "isLoaded": false,
    "isLoading": true,
    "isNew": false,
    "isSaving": false
  });

  model.load();
  await this.stores.settle();
});

test('delete saved document', async function(assert) {
  await this.recreate();
  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let model = doc.model(true);

  await doc.save();

  assert.deepEqual(model.get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": true,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isSaving": false
    }
  });

  let promise = doc.delete();

  await wait();

  assert.deepEqual(model.get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": true,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isSaving": true
    }
  });

  await promise;

  assert.deepEqual(model.get('serialized'), {
    "data": {
      "name": "Yellow"
    },
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": false,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isSaving": false
    }
  });
});

test('delete local document', async function(assert) {
  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  try {
    await doc.delete();
    assert.ok(false, 'should reject');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "local",
      "reason": "document is not yet saved"
    });
  }
});

test('delete not yet loaded doc', async function(assert) {
  await this.recreate();
  await this.coll.doc('yellow').set({ name: 'Yellow' });

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });

  await doc.delete();

  await waitForCollectionSize(this.coll, 0);

  assert.deepEqual(doc.model(true).get('serialized'), {
    "data": {},
    "ref": {
      "collection": "ducks",
      "id": "yellow",
      "path": "ducks/yellow"
    },
    "state": {
      "error": null,
      "isDirty": false,
      "isError": false,
      "isExisting": false,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isSaving": false
    }
  });
});

test('resolve non-dirty doc save', async function(assert) {
  await this.recreate();

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  await doc.save();

  assert.ok(!doc.state.isDirty);

  doc.model(true).set('data.name', 'modified');

  assert.ok(doc.state.isDirty);

  doc.state.isDirty = false;
  await doc.save();

  let snapshot = await this.coll.doc('yellow').get();
  assert.deepEqual(snapshot.data(), {
    "name": "Yellow"
  });
});

test('non-existant document does not overwrite dirty state', async function(assert) {
  await this.recreate();

  let doc = this.existing({ collection: 'ducks', id: 'yellow', data: { name: 'yellow' }, create: true });
  let model = doc.model(true);

  assert.deepEqual(model.get('serialized.data'), {
    "name": "yellow"
  });

  await doc.load({ optional: true });

  assert.deepEqual(model.get('serialized.data'), {
    "name": "yellow"
  });
});

test('save with document reference', async function(assert) {
  await this.recreate();

  let ref = this.coll.doc('foo');
  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow', ref } });

  await doc.save();

  let snapshot = await this.firestore.doc('ducks/yellow').get();
  assert.ok(snapshot.data().ref.isEqual(ref));
});

test('load with document reference', async function(assert) {
  let ref = this.coll.doc('foo');

  await this.recreate();
  await this.firestore.doc('ducks/yellow').set({ ref });

  let doc = this.existing({ collection: 'ducks', id: 'yellow', create: true });
  let model = doc.model(true);
  await doc.load();

  assert.deepEqual(model.get('serialized.data'), {
    "ref": {
      "path": "ducks/foo",
      "type": "document-reference"
    }
  });

  assert.ok(model.get('data.ref').isEqual(ref));
});

test('snapshot update marks document non-dirty', async function(assert) {
  await this.recreate();

  let doc = this.local({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  let model = doc.model(true);

  await model.save();

  assert.equal(model.get('isDirty'), false);
  model.set('data.name', 'Green');
  assert.equal(model.get('isDirty'), true);

  await this.coll.doc('yellow').set({ name: 'Red' }, { merge: true });
  await waitForProp(model, 'data.name', 'Red');

  assert.equal(model.get('isDirty'), false);
});

test('save local with server timestamp', async function(assert) {
  await this.recreate();

  let doc = this.local({
    id: 'yellow',
    collection: 'ducks',
    data: {
      now: serverTimestamp()
    }
  });

  let model = doc.model(true);

  await model.save();

  await waitForCollectionSize(this.firestore.collection('ducks'), 1);

  assert.equal(typeOf(model.get('data.now')), 'date');
});

test('update with server timestamp', async function(assert) {
  await this.recreate();

  let doc = this.local({
    id: 'yellow',
    collection: 'ducks',
    data: {
      now: serverTimestamp()
    }
  });

  let model = doc.model(true);
  await model.save();
  await waitForCollectionSize(this.firestore.collection('ducks'), 1);

  let now = model.get('data.now');

  model.set('data.now', serverTimestamp());
  await model.save();
  await waitForCollectionSize(this.firestore.collection('ducks'), 1);

  assert.equal(typeOf(model.get('data.now')), 'date');
  assert.ok(model.get('data.now').getTime() !== now.getTime());
});
