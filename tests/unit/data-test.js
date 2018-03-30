import EmberObject from '@ember/object';
import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import DataObject from 'ember-cli-zug/-private/model/data/object';
import DataArray from 'ember-cli-zug/-private/model/data/array';
import firebase from 'firebase';

const Thing = EmberObject.extend({
  toJSON() {
    return this.getProperties('name');
  }
});

module('data', {
  beforeEach() {
    this.manager = this.store._internal.dataManager;
    this.doc = path => this.store._internal.firestore.doc(path);
    this.geopoint = (lat, lng) => new firebase.firestore.GeoPoint(lat, lng);
    this.create = json => this.manager.createInternal(json, 'model').model(true);
  }
});

test('manager exists', function(assert) {
  assert.ok(this.manager);
});

test('create empty object', function(assert) {
  let object = this.create();
  assert.ok(object);
  assert.ok(DataObject.detectInstance(object));
});

test('set primitive', function(assert) {
  let object = this.create();
  object.set('name', 'duck');
  assert.equal(object.get('name'), 'duck');
  assert.equal(object._internal.content.name, 'duck');
  assert.deepEqual(Object.keys(object._internal.content), [ 'name' ]);
});

test('unset primitive', function(assert) {
  let object = this.create();
  object.set('name', 'duck');
  object.set('name', undefined);
  assert.equal(object.get('name'), undefined);
  assert.deepEqual(Object.keys(object._internal.content), []);
});

test('set object', function(assert) {
  let object = this.create();
  object.set('person', { name: 'duck' });
  assert.ok(DataObject.detectInstance(object.get('person')));
  assert.equal(object.get('person.name'), 'duck');
  assert.ok(object.get('person')._internal.parent === object._internal);
});

test('update object', function(assert) {
  let object = this.create();
  object.set('person', { name: 'duck', type: 'cute' });
  let person = object.get('person');

  object.set('person', { name: 'zeeba' });
  assert.ok(object.get('person') === person);
  assert.ok(object.get('person')._internal === person._internal);
  assert.ok(object.get('person')._internal.parent === object._internal);

  assert.ok(DataObject.detectInstance(object.get('person')));
  assert.equal(object.get('person.name'), 'zeeba');
  assert.equal(object.get('person.type'), undefined);
});

test('serialize nested object', function(assert) {
  let object = this.create();
  object.set('id', '123');
  object.set('person', { name: 'duck', type: 'cute' });
  assert.deepEqual(object.toJSON(), {
    "id": "123",
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });
})

test('create object with nested object', function(assert) {
  let object = this.create({ person: { name: 'duck', type: 'cute' } });
  let person = object.get('person');

  assert.ok(object._internal.parent === null);
  assert.ok(person._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });
});

test('set internal object', function(assert) {
  let person = this.create({ name: 'duck', type: 'cute' });
  let object = this.create({ person });

  assert.ok(person._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });
});

test('replace internal object', function(assert) {
  let person = this.create({ name: 'duck', type: 'cute' });
  let object = this.create({ person });

  assert.ok(person._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });

  let second = this.create({ name: 'zeeba' });

  object.set('person', second);

  assert.ok(person._internal.parent === null);
  assert.ok(second._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "zeeba"
    }
  });
});

test('set already attached object clones it', function(assert) {
  let object = this.create({ person: { name: 'duck', type: 'cute' } });
  let source = object.get('person');
  let second = this.create();
  second.set('person', source);
  let target = second.get('person');

  assert.ok(source !== target);
  assert.ok(source._internal !== target._internal);

  assert.deepEqual(second.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });

  assert.ok(source._internal.parent === object._internal);
  assert.ok(target._internal.parent === second._internal);
});

test('set instance with toJSON', function(assert) {
  let person = Thing.create({ name: 'zeeba' });
  let object = this.create({ person });
  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "zeeba"
    }
  });
  assert.ok(object.get('person') !== person);
  assert.ok(object.get('person')._internal.parent === object._internal);
});

test('set instance without toJSON', function(assert) {
  let person = EmberObject.create({ name: 'zeeba' });
  let object = this.create({ person });
  assert.deepEqual(object.toJSON(), {});
});

test('didUpdateChildInternalData', function(assert) {
  assert.expect(2);
  let parent = {
    didUpdateChildInternalData(internal, notify) {
      assert.ok(internal.content.person);
      assert.ok(notify);
    }
  };
  let object = this.create({ person: { name: 'duck', type: 'cute' } });
  object._internal.attach(parent);
  object.get('person').set('name', 'zeeba');
});

test('init with array creates DataArray', function(assert) {
  let object = this.create({ names: [] });
  let names = object.get('names');
  assert.ok(DataArray.detectInstance(names));
  assert.deepEqual(object.toJSON(), {
    names: []
  });
});

test('init with array of primitives - serialize', function(assert) {
  let object = this.create({ names: [ 'a', 'b', 'c' ] })
  assert.deepEqual(object.toJSON(), {
    "names": [
      "a",
      "b",
      "c"
    ]
  });
});

test('init with array of objects - serialize', function(assert) {
  let object = this.create({ names: [ { name: 'a' }, { name: 'b' }, { name: 'c' } ] });
  assert.deepEqual(object.toJSON(), {
    "names": [
      { "name": "a" },
      { "name": "b" },
      { "name": "c" }
    ]
  });
});

test('add and get primitive in array', function(assert) {
  let object = this.create({ names: [] });
  object.get('names').pushObject('a');
  assert.deepEqual(object.toJSON(), { "names": [ "a" ] });
  let value = object.get('names.firstObject');
  assert.equal(value, 'a');
});

test('add and get object from array', function(assert) {
  let object = this.create({ names: [] });
  object.get('names').pushObject({ name: 'a' });
  assert.deepEqual(object.toJSON(), { "names": [ { "name": "a" } ] });
  let value = object.get('names.firstObject');
  assert.equal(value.get('name'), 'a');
});

test('parent serialized', function(assert) {
  let object = this.create();
  assert.deepEqual(object.get('serialized'), {});

  object.set('names', []);
  assert.deepEqual(object.get('serialized'), { names: [] });

  object.get('names').pushObject({});
  assert.deepEqual(object.get('serialized'), { names: [ {} ] });

  object.get('names.firstObject').set('name', 'a');
  assert.deepEqual(object.get('serialized'), { names: [ { name: 'a' } ] });

  object.get('names.firstObject').set('name', 'b');
  assert.deepEqual(object.get('serialized'), { names: [ { name: 'b' } ] });

  object.get('names').removeAt(0);
  assert.deepEqual(object.get('serialized'), { names: [] });

  object.set('names', [ { ok: true }]);
  assert.deepEqual(object.get('serialized'), { names: [ { ok: true } ] });

  object.set('names', [ 'hey' ]);
  assert.deepEqual(object.get('serialized'), { names: [ 'hey' ] });

  object.set('names', [ [ { ok: [ 'a' ] } ] ]);
  assert.deepEqual(object.get('serialized'), { names: [ [ { ok: [ 'a' ] }] ] });

  object.set('names');
  assert.deepEqual(object.get('serialized'), {});

  object.set('names', [ [ { ok: [ 'a' ] } ] ]);
  assert.deepEqual(object.get('serialized'), { names: [ [ { ok: [ 'a' ] }] ] });

  object.set('names');
  assert.deepEqual(object.get('serialized'), {});

  object.set('name', { value: 'a' });
  assert.deepEqual(object.get('serialized'), { name: { value: 'a' } });

  object.get('name').set('value', 'b');
  assert.deepEqual(object.get('serialized'), { name: { value: 'b' } });

  object.get('name').set('value');
  assert.deepEqual(object.get('serialized'), { name: {} });

  object.get('name').set('value', 'a');
  assert.deepEqual(object.get('serialized'), { name: { value: 'a' } });

  object.set('name');
  assert.deepEqual(object.get('serialized'), {});
});

test('update property: array to array', function(assert) {
  let object = this.create();
  assert.deepEqual(object.get('serialized'), {});

  this.manager.updateInternal(object._internal, { names: [ 'a' ] }, 'storage');
  assert.deepEqual(object.get('serialized'), { names: [ 'a' ] });

  this.manager.updateInternal(object._internal, { names: [ { ok: true } ] }, 'storage');
  assert.deepEqual(object.get('serialized'), { names: [ { ok: true } ] });
});

test('update property: array to object', function(assert) {
  let object = this.create();
  assert.deepEqual(object.get('serialized'), {});

  this.manager.updateInternal(object._internal, { names: [ 'a' ] }, 'storage');
  assert.deepEqual(object.get('serialized'), { names: [ 'a' ] });

  let one = object.get('names');

  this.manager.updateInternal(object._internal, { names: { ok: true } }, 'storage');
  assert.deepEqual(object.get('serialized'), { names: { ok: true } });

  let two = object.get('names');

  assert.ok(one !== two);
  assert.ok(!one._internal.parent);
  assert.ok(!one._internal.observing);
});

test('remove object by index from array is detached', function(assert) {
  let object = this.create({ names: [ { name: 'a' }]});
  let name = object.get('names.firstObject');
  assert.ok(name._internal.parent === object._internal.content.names);
  object.get('names').removeAt(0);
  assert.ok(name._internal.parent === null);
});

test('remove object from array is detached', function(assert) {
  let object = this.create({ names: [ { name: 'a' }]});
  let name = object.get('names.firstObject');
  assert.ok(name._internal.parent === object._internal.content.names);
  object.get('names').removeObject(name);
  assert.ok(name._internal.parent === null);
});

test('overwrite array', function(assert) {
  let object = this.create({ names: [ { name: 'a' }]});
  object.set('names', [ { name: 'b' } ]);
  assert.deepEqual(object.get('serialized'), {
    "names": [
      {
        "name": "b"
      }
    ]
  });
});

test('overwrite array with model array', function(assert) {
  let names = this.create([ { name: 'b' } ]);
  let object = this.create({ names: [ { name: 'a' } ]});

  let prev = object.get('names');

  assert.ok(prev._internal.parent === object._internal);
  assert.ok(names._internal.parent === null);

  object.set('names', names);

  assert.deepEqual(object.get('serialized'), {
    "names": [
      {
        "name": "b"
      }
    ]
  });

  assert.ok(prev._internal.parent === null);
  assert.ok(names._internal.parent === object._internal);
});

test('array stops observing when detached', function(assert) {
  let object = this.create({ names: [ { name: 'a' } ]});
  let names = object.get('names');
  assert.ok(names._internal.observing);
  object.set('names');
  assert.ok(!names._internal.observing);
  object.set('names', names);
  assert.ok(names._internal.observing);
});

test('array is not initially observing', function(assert) {
  let names = this.create([ { name: 'a' } ]);
  assert.ok(!names._internal.observing);
  this.create({ names });
  assert.ok(names._internal.observing);
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

  assert.deepEqual(doc.get('serialized'), {
    "person": {
      "name": "duck"
    }
  });

  doc.set('person', { email: 'duck@gmail.com' });

  assert.deepEqual(doc.toJSON(), {
    "person": {
      "email": "duck@gmail.com"
    }
  });

  assert.deepEqual(doc.get('serialized'), {
    "person": {
      "email": "duck@gmail.com"
    }
  });
});

test('object set primitive value', function(assert) {
  let doc = this.create();
  assert.equal(doc.get('name'), undefined);

  assert.deepEqual(doc.toJSON(), {
  });

  assert.deepEqual(doc.get('serialized'), {
  });

  doc.set('name', 'zeeba');
  assert.equal(doc.get('name'), 'zeeba');

  assert.deepEqual(doc.toJSON(), {
    name: 'zeeba'
  });

  assert.deepEqual(doc.get('serialized'), {
    name: 'zeeba'
  });
});

test('object replace primitive value with primitive value', function(assert) {
  let doc = this.create();
  assert.equal(doc.get('name'), undefined);

  assert.deepEqual(doc.get('serialized'), {
  });

  doc.set('name', 'zeeba');
  assert.equal(doc.get('name'), 'zeeba');

  assert.deepEqual(doc.get('serialized'), {
    name: 'zeeba'
  });

  doc.set('name', 'larry');
  assert.equal(doc.get('name'), 'larry');

  assert.deepEqual(doc.get('serialized'), {
    name: 'larry'
  });
});

test('object replace object with primitive', function(assert) {
  let doc = this.create({ person: { name: 'zeeba' } });

  assert.deepEqual(doc.get('serialized'), {
    "person": {
      "name": "zeeba"
    }
  });

  let person = doc._internal.content.person;
  assert.ok(person.parent === doc._internal);

  doc.set('person', 'zeeba');

  assert.deepEqual(doc.get('serialized'), {
    "person": "zeeba"
  });

  assert.ok(person.parent === null);
});

test('object replace primitive with object', function(assert) {
  let doc = this.create({ person: 'zeeba' });

  assert.deepEqual(doc.get('serialized'), {
    "person": "zeeba"
  });

  doc.set('person', { name: 'zeeba' });

  assert.deepEqual(doc.get('serialized'), {
    "person": {
      "name": "zeeba"
    }
  });

  assert.ok(doc._internal.content.person.parent === doc._internal);
});

test('object with empty array', function(assert) {
  let doc = this.create({ names: [] });
  assert.deepEqual(doc.get('serialized'), {
    names: []
  });
});

test('object with empty array replace', function(assert) {
  let doc = this.create({ names: [] });

  let first = doc._internal.content.names;

  assert.deepEqual(doc.get('serialized'), {
    names: []
  });

  doc.set('names', []);
  let second = doc._internal.content.names;

  assert.ok(first);
  assert.ok(first === second);
});

test('object with array of strings', function(assert) {
  let doc = this.create({ names: [ 'one', 'two' ] });
  assert.deepEqual(doc.get('serialized'), {
    names: [ 'one', 'two' ]
  });
});

test('object with array of objects', function(assert) {
  let doc = this.create({ names: [ { name: 'one' }, { name: 'two' } ] });

  let array = doc._internal.content.names;

  assert.ok(array.parent === doc._internal);
  assert.ok(array.content[0].parent === array);
  assert.ok(array.content[1].parent === array);

  assert.deepEqual(doc.get('serialized'), {
    "names": [
      {
        "name": "one"
      },
      {
        "name": "two"
      }
    ]
  });
});

test('object with array of strings replace with objects', function(assert) {
  let doc = this.create({ names: [ 'one', 'two' ] });

  assert.deepEqual(doc.get('serialized'), {
    "names": [
      "one",
      "two"
    ]
  });

  doc.set('names', [ { name: 'one' }, { name: 'two' } ]);

  assert.deepEqual(doc.get('serialized'), {
    "names": [
      {
        "name": "one"
      },
      {
        "name": "two"
      }
    ]
  });
});

test('array with objects doesnt replace equal ones', function(assert) {
  let doc = this.create({
    ducks: [
      { name: 'yellow' },
      { name: 'blue' },
      { name: 'green' }
    ]
  });

  let first = doc._internal.content.ducks.content.copy();

  doc.set('ducks', [
    { name: 'yellow' },
    { name: 'red' },
    { name: 'green' }
  ]);

  let second = doc._internal.content.ducks.content.copy();

  assert.ok(first[0] === second[0]);
  assert.ok(first[2] === second[2]);

  assert.deepEqual(doc.get('serialized'), {
    "ducks": [
      {
        "name": "yellow"
      },
      {
        "name": "red"
      },
      {
        "name": "green"
      }
    ]
  });
});

test('serialize and deserialize ref', function(assert) {
  let ref = this.doc('author/zeeba');
  let doc = this.create({ owner: ref });
  assert.ok(doc._internal.content.owner === ref);

  assert.deepEqual(doc.get('serialized'), {
    "owner": {
      "path": "author/zeeba",
      "type": "document-reference"
    }
  });

  assert.deepEqual(doc.toJSON('model'), {
    "owner": ref
  });

  assert.deepEqual(doc.toJSON('storage'), {
    "owner": ref
  });
});

test('document reference update equality', function(assert) {
  let ref1 = this.doc('author/zeeba');
  let ref2 = this.doc('author/zeeba');
  assert.ok(ref1 !== ref2);

  let doc = this.create({ owner: ref1 });
  assert.ok(doc._internal.content.owner === ref1);

  doc.set('owner', ref2);
  assert.ok(doc._internal.content.owner === ref1);
});

test('serialize and deserialize geopoint', function(assert) {
  let geopoint = this.geopoint(10, 20);
  let doc = this.create({ location: geopoint });
  assert.ok(doc._internal.content.location === geopoint);

  assert.deepEqual(doc.get('serialized'), {
    "location": {
      "latitude": 10,
      "longitude": 20,
      "type": "geopoint"
    }
  });

  assert.deepEqual(doc.toJSON('model'), {
    "location": geopoint
  });

  assert.deepEqual(doc.toJSON('storage'), {
    "location": geopoint
  });
});
