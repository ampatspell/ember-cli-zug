import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';

module('data-serialization', {
  beforeEach() {
    this.manager = this.store._internal.dataManager;
    this.create = json => this.manager.createInternal(json).model(true);
  }
});

test('create empty', function(assert) {
  let doc = this.create();
  assert.deepEqual(doc.get('serialized'), {});
});

test('create with object', function(assert) {
  let doc = this.create({ person: { name: 'duck' } });
  assert.deepEqual(doc.get('serialized'), {
    "person": {
      "name": "duck"
    }
  });
});

test('object replace with object', function(assert) {
  let doc = this.create({ person: { name: 'duck' } });
  assert.deepEqual(doc.toJSON(), {
    "person": {
      "name": "duck"
    }
  });
  // assert.deepEqual(doc.get('serialized'), {
  //   "person": {
  //     "name": "duck"
  //   }
  // });

  doc.set('person', { email: 'duck@gmail.com' });
  assert.deepEqual(doc.toJSON(), {
    "person": {
      "email": "duck@gmail.com"
    }
  });

  // assert.deepEqual(doc.get('serialized'), {
  //   "person": {
  //     "email": "duck@gmail.com"
  //   }
  // });
});

test('object set primitive value', function(assert) {
  let doc = this.create();
  assert.equal(doc.get('name'), undefined);

  doc.set('name', 'zeeba');
  assert.equal(doc.get('name'), 'zeeba');

  assert.deepEqual(doc.get('serialized'), {
    name: 'zeeba'
  });
});

test('object replace primitive value with primitive value', function(assert) {
  let doc = this.create();
  assert.equal(doc.get('name'), undefined);

  doc.set('name', 'zeeba');
  assert.equal(doc.get('name'), 'zeeba');

  doc.set('name', 'larry');
  assert.equal(doc.get('name'), 'larry');

  assert.deepEqual(doc.get('serialized'), {
    name: 'zeeba'
  });
});
