import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';

module('local-document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.create = props => this.store._internal.documents.createNewDocument(props);
  }
});

test('create a document', function(assert) {
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

test('create document without data', function(assert) {
  let doc = this.create({ collection: 'ducks', id: 'yellow' });

  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });

  assert.deepEqual(doc.get('data.serialized'), {});
});

test('create document with path', function(assert) {
  let doc = this.create({ path: 'ducks/yellow' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: 'ducks',
    path: 'ducks/yellow'
  });
});

test('create document with collection', function(assert) {
  let doc = this.create({ collection: 'ducks' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: 'ducks',
    path: undefined
  });
});

test('create blank document', function(assert) {
  let doc = this.create({});
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: undefined,
    collection: undefined,
    path: undefined
  });
});

test('create document with id', function(assert) {
  let doc = this.create({ id: 'yellow' });
  assert.deepEqual(doc.getProperties('id', 'collection', 'path'), {
    id: 'yellow',
    collection: undefined,
    path: undefined
  });
});

test('updates', function(assert) {
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
