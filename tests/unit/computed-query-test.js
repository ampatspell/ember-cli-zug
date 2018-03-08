import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import TransientModel from 'models/model/transient';
import PersistentModel from 'models/model/persisted';
import { query } from 'models/model/computed';
import { recreateCollection } from '../helpers/runloop';
import { cacheFor } from 'models/-private/util/destroyable-computed';
import { run } from '@ember/runloop';

const State = TransientModel.extend({

  ducks: query({
    type: 'array',
    query: db => db.collection('ducks').orderBy('name')
  }),

  duck: query({
    type: 'single',
    query: db => db.collection('ducks').orderBy('name')
  }),

  order: 'name',

  dependent: query(function() {
    let order = this.get('order');
    return {
      id: `by-${order}`,
      type: 'array',
      owner: [ 'order' ],
      query: db => db.collection('ducks').orderBy(order)
    }
  }),

});

const Duck = PersistentModel.extend();

module('computed-query', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';

    this.register('model:duck', Duck);
    this.register('model:state', State);

    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      { __name__: 'yellow', name: 'yellow', pos: 0 },
      { __name__: 'green',  name: 'green',  pos: 1 },
      { __name__: 'red',    name: 'red',    pos: 2 }
    ]);
  }
});

test('load array', async function(assert) {
  await this.recreate();

  let state = this.store.model({ name: 'state' });
  let ducks = state.get('ducks');

  assert.equal(ducks.get('isLoading'), true);
  assert.deepEqual(ducks.get('content').mapBy('doc.id'), []);

  await ducks.load();

  assert.equal(ducks.get('isLoading'), false);
  assert.deepEqual(ducks.get('content').mapBy('doc.id'), [ "green", "red", "yellow" ]);
});

test('load single', async function(assert) {
  await this.recreate();

  let state = this.store.model({ name: 'state' });
  let duck = state.get('duck');

  assert.equal(duck.get('isLoading'), true);
  assert.equal(duck.get('content'), null);

  await duck.load();

  assert.equal(duck.get('isLoading'), false);
  assert.equal(duck.get('content.doc.id'), 'green');
});

test('property is reused, query -- recreated', async function(assert) {
  let state = this.store.model({ name: 'state' });

  let first = state.get('dependent');
  let firstProp = cacheFor(state, 'dependent');

  assert.equal(first.get('id'), 'by-name');

  await first.load();
  assert.deepEqual(first.get('content').mapBy('doc.id'), [ "green", "red", "yellow" ]);

  run(() => state.set('order', 'pos'));

  assert.ok(first.isDestroyed);

  let second = state.get('dependent');
  let secondProp = cacheFor(state, 'dependent');
  assert.ok(second !== first);
  assert.ok(firstProp === secondProp);

  assert.equal(second.get('id'), 'by-pos');

  await second.load();
  assert.deepEqual(second.get('content').mapBy('doc.id'), [ "yellow", "green", "red" ]);
});

test('settle', async function(assert) {
  await this.recreate();

  let state = this.store.model({ name: 'state' });
  let duck = state.get('duck');

  assert.equal(duck.get('isLoading'), true);
  assert.equal(duck.get('content'), null);

  duck.load();

  assert.equal(duck.get('isLoading'), true);
  assert.equal(duck.get('content'), null);

  await this.store.settle();

  assert.equal(duck.get('isLoading'), false);
  assert.equal(duck.get('content.doc.id'), 'green');
});
