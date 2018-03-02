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
