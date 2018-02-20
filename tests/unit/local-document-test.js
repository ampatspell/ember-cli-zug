import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection } from '../helpers/runloop';

module('local-document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
    this.create = props => this.store._internal.documentsManager.createNewInternalDocument(props);
    this.existing = opts => this.store._internal.documentsManager.existingInternalDocument(opts);
  }
});

test('create a basic document', async function(assert) {
  let internal = this.create({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
  assert.ok(internal);

  let doc = internal.model(true);
  assert.ok(doc);

  assert.deepEqual(doc.get('serialized'), {
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
      "isDirty": true,
      "isError": false,
      "isExisting": undefined,
      "isNew": true,
      "isSaving": false
    }
  });
});

test('second save blows up on local conflict', async function(assert) {
  await this.recreate();

  let first = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Yellow' } });
  await first.save();

  let second = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Another' } });

  try {
    await second.save();
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "conflict",
      "reason": "document with the same path already exists"
    });
  }
});

test('existing and save blows up on local conflict', async function(assert) {
  await this.recreate();

  this.existing({ collection: 'ducks', id: 'yellow', data: { name: 'Yellow' }, create: true });

  let second = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Another' } });

  try {
    await second.save();
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "conflict",
      "reason": "document with the same path already exists"
    });
  }
});

test('create a document', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Yellow' } });
  let model = doc.model(true);

  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });

  assert.deepEqual(model.get('data.serialized'), {
    name: 'Yellow'
  });
});

test('update data', function(assert) {
  let doc = this.create({ data: { name: 'Yellow' } });
  let model = doc.model(true);

  model.set('data.thing', { ok: true });
  assert.deepEqual(model.get('data.serialized'), {
    name: 'Yellow',
    thing: { ok: true }
  });
});

test('create document without data', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow' });
  let model = doc.model(true);

  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });

  assert.deepEqual(model.get('data.serialized'), {});
});

test('create document with path', function(assert) {
  let doc = this.create({ path: 'ducks/yellow' });
  let model = doc.model(true);
  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });
});

test('create document with collection', function(assert) {
  let doc = this.create({ collection: 'ducks' });
  let model = doc.model(true);
  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: 'ducks',
    path: undefined
  });
});

test('create blank document', function(assert) {
  let doc = this.create({});
  let model = doc.model(true);
  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: undefined,
    path: undefined
  });
});

test('create document with id', function(assert) {
  let doc = this.create({ id: 'yellow' });
  let model = doc.model(true);
  assert.deepEqual(model.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: undefined,
    path: undefined
  });
});

test('updates', function(assert) {
  let doc = this.create({});
  let model = doc.model(true);
  let mut = (values, expected) => {
    model.setProperties(values);
    assert.deepEqual(model.getProperties('id', 'collection', 'path'), expected);
  }
  mut({ id: 'yellow' }, { id: 'yellow', collection: undefined, path: undefined });
  mut({ collection: 'ducks' }, { id: 'yellow', collection: 'ducks', path: 'ducks/yellow' });
  mut({ path: 'things/foo' }, { id: 'foo', collection: 'things', path: 'things/foo' });
  mut({ collection: 'things/ducks' }, { id: 'foo', collection: 'things/ducks', path: 'things/ducks/foo' });
  mut({ path: undefined }, { id: undefined, collection: undefined, path: undefined });
});
