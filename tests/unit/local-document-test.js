import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';

module('local-document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.create = props => this.store._internal.documents.createNewDocument(props);
  }
});

test('create a basic document', async function(assert) {
  let internal = this.store._internal.documentsManager.createNewInternalDocument({ id: 'yellow', collection: 'ducks', data: { name: 'Yellow' } });
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
      "error": null,
      "isDirty": true,
      "isError": false,
      "isExisting": undefined,
      "isNew": true,
      "isSaving": false
    }
  });
});

test.skip('create a document', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Yellow' } });

  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });

  assert.deepEqual(doc.get('data.serialized'), {
    name: 'Yellow'
  });
});

test.skip('document serialized', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow', data: { name: 'Yellow' } });
  assert.deepEqual(doc.get('serialized'), {
    "id": "yellow",
    "collection": "ducks",
    "path": "ducks/yellow",
    "exists": undefined,
    "data": {
      "name": "Yellow"
    },
  });
});

test.skip('update data', function(assert) {
  let doc = this.create({ data: { name: 'Yellow' } });
  doc.set('data.thing', { ok: true });
  assert.deepEqual(doc.get('data.serialized'), {
    name: 'Yellow',
    thing: { ok: true }
  });
});

test.skip('create document without data', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow' });

  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });

  assert.deepEqual(doc.get('data.serialized'), {});
});

test.skip('create document with path', function(assert) {
  let doc = this.create({ path: 'ducks/yellow' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });
});

test.skip('create document with collection', function(assert) {
  let doc = this.create({ collection: 'ducks' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: 'ducks',
    path: undefined
  });
});

test.skip('create blank document', function(assert) {
  let doc = this.create({});
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: undefined,
    path: undefined
  });
});

test.skip('create document with id', function(assert) {
  let doc = this.create({ id: 'yellow' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: undefined,
    path: undefined
  });
});

test.skip('updates', function(assert) {
  let doc = this.create({});
  let mut = (values, expected) => {
    doc.setProperties(values);
    assert.deepEqual(doc.getProperties('id', 'collection', 'path'), expected);
  }
  mut({ id: 'yellow' }, { id: 'yellow', collection: undefined, path: undefined });
  mut({ collection: 'ducks' }, { id: 'yellow', collection: 'ducks', path: 'ducks/yellow' });
  mut({ path: 'things/foo' }, { id: 'foo', collection: 'things', path: 'things/foo' });
  mut({ collection: 'things/ducks' }, { id: 'foo', collection: 'things/ducks', path: 'things/ducks/foo' });
  mut({ path: undefined }, { id: undefined, collection: undefined, path: undefined });
});
