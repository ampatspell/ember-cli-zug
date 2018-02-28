import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import TransientModel from 'models/model/transient';
import PersistentModel from 'models/model/persisted';
import { query } from 'models/computed';
import { recreateCollection } from '../helpers/runloop';

const State = TransientModel.extend({

  ducks: query({
    type: 'array',
    query: db => db.collection('ducks').orderBy('name')
  }),

  duck: query({
    type: 'single',
    query: db => db.collection('ducks').orderBy('name')
  })

});

const Duck = PersistentModel.extend();

module('computed-query', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';

    this.register('model:duck', Duck);
    this.register('model:state', State);

    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      { __name__: 'yellow', name: 'yellow' },
      { __name__: 'green',  name: 'green' },
      { __name__: 'red',    name: 'red' }
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
