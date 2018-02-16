import EmberObject from '@ember/object';
import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import DataObject from 'models/-private/model/data/object';
import DataArray from 'models/-private/model/data/array';

const Thing = EmberObject.extend({
  toJSON() {
    return this.getProperties('name');
  }
});

module('document-data', {
  beforeEach() {
    this.manager = this.store._internal.data;
  }
});

test('manager exists', function(assert) {
  assert.ok(this.manager);
});

test('create empty object', function(assert) {
  let object = this.manager.createObject();
  assert.ok(object);
  assert.ok(DataObject.detectInstance(object));
});

test('set primitive', function(assert) {
  let object = this.manager.createObject();
  object.set('name', 'duck');
  assert.equal(object.get('name'), 'duck');
  assert.equal(object._internal.content.name, 'duck');
  assert.deepEqual(Object.keys(object._internal.content), [ 'name' ]);
});

test('unset primitive', function(assert) {
  let object = this.manager.createObject();
  object.set('name', 'duck');
  object.set('name', undefined);
  assert.equal(object.get('name'), undefined);
  assert.deepEqual(Object.keys(object._internal.content), []);
});

test('set object', function(assert) {
  let object = this.manager.createObject();
  object.set('person', { name: 'duck' });
  assert.ok(DataObject.detectInstance(object.get('person')));
  assert.equal(object.get('person.name'), 'duck');
  assert.ok(object.get('person')._internal.parent === object._internal);
});

test('update object', function(assert) {
  let object = this.manager.createObject();
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
  let object = this.manager.createObject();
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
  let object = this.manager.createObject({ person: { name: 'duck', type: 'cute' } });
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
  let person = this.manager.createObject({ name: 'duck', type: 'cute' } );
  let object = this.manager.createObject({ person });

  assert.ok(person._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });
});

test('replace internal object', function(assert) {
  let person = this.manager.createObject({ name: 'duck', type: 'cute' });
  let object = this.manager.createObject({ person });

  assert.ok(person._internal.parent === object._internal);

  assert.deepEqual(object.toJSON(), {
    "person": {
      "name": "duck",
      "type": "cute"
    }
  });

  let second = this.manager.createObject({ name: 'zeeba' } );

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
  let object = this.manager.createObject({ person: { name: 'duck', type: 'cute' } });
  let source = object.get('person');
  let second = this.manager.createObject();
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
  let object = this.manager.createObject({ person });
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
  let object = this.manager.createObject({ person });
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
  let object = this.manager.createObject({ person: { name: 'duck', type: 'cute' } });
  object._internal.attach(parent);
  object.get('person').set('name', 'zeeba');
});

test('init with array creates DataArray', function(assert) {
  let object = this.manager.createObject({ names: [] });
  let names = object.get('names');
  assert.ok(DataArray.detectInstance(names));
  assert.deepEqual(object.toJSON(), {
    names: []
  });
});

test('init with array of primitives - serialize', function(assert) {
  let object = this.manager.createObject({ names: [ 'a', 'b', 'c' ] });
  assert.deepEqual(object.toJSON(), {
    "names": [
      "a",
      "b",
      "c"
    ]
  });
});

test('init with array of objects - serialize', function(assert) {
  let object = this.manager.createObject({ names: [ { name: 'a' }, { name: 'b' }, { name: 'c' } ] });
  assert.deepEqual(object.toJSON(), {
    "names": [
      { "name": "a" },
      { "name": "b" },
      { "name": "c" }
    ]
  });
});

test('add and get primitive in array', function(assert) {
  let object = this.manager.createObject({ names: [] });
  object.get('names').pushObject('a');
  assert.deepEqual(object.toJSON(), { "names": [ "a" ] });
  let value = object.get('names.firstObject');
  assert.equal(value, 'a');
});

test('add and get object from array', function(assert) {
  let object = this.manager.createObject({ names: [] });
  object.get('names').pushObject({ name: 'a' });
  assert.deepEqual(object.toJSON(), { "names": [ { "name": "a" } ] });
  let value = object.get('names.firstObject');
  assert.equal(value.get('name'), 'a');
});

test('parent serialized', function(assert) {
  let object = this.manager.createObject();
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

test('remove object by index from array is detached', function(assert) {
  let object = this.manager.createObject({ names: [ { name: 'a' }]});
  let name = object.get('names.firstObject');
  assert.ok(name._internal.parent === object._internal.content.names);
  object.get('names').removeAt(0);
  assert.ok(name._internal.parent === null);
});

test('remove object from array is detached', function(assert) {
  let object = this.manager.createObject({ names: [ { name: 'a' }]});
  let name = object.get('names.firstObject');
  assert.ok(name._internal.parent === object._internal.content.names);
  object.get('names').removeObject(name);
  assert.ok(name._internal.parent === null);
});

test('overwrite array', function(assert) {
  let object = this.manager.createObject({ names: [ { name: 'a' }]});
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
  let names = this.manager.createArray([ { name: 'b' } ]);
  let object = this.manager.createObject({ names: [ { name: 'a' } ]});

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
  let object = this.manager.createObject({ names: [ { name: 'a' } ]});
  let names = object.get('names');
  assert.ok(names._internal.observing);
  object.set('names');
  assert.ok(!names._internal.observing);
  object.set('names', names);
  assert.ok(names._internal.observing);
});

test('array is not initially observing', function(assert) {
  let names = this.manager.createArray([ { name: 'a' } ]);
  assert.ok(!names._internal.observing);
  this.manager.createObject({ names });
  assert.ok(names._internal.observing);
});
