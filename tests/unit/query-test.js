import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection } from '../helpers/runloop';
import PersistedModel from 'ember-cli-zug/model/persisted';
import { attr } from 'ember-cli-zug/model/persisted/computed';

const Duck = PersistedModel.extend({
  name: attr()
});

module('query', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
    this.coll = this.firestore.collection('ducks');
    await recreateCollection(this.coll, [
      { name: 'yellow' },
      { name: 'green' },
      { name: 'red' }
    ]);
    this.create = opts => this.store._internal.queriesManager.createInternalQuery(opts);
  }
});

test('query collection', async function(assert) {
  let internal = this.create({ id: 'foo', type: 'array', query: db => db.collection('ducks').orderBy('name') });
  let query = internal.model(true);

  assert.equal(query.get('type'), 'array');
  assert.equal(query.get('id'), 'foo');

  assert.deepEqual(query.getProperties('isLoading', 'isLoaded'), {
    "isLoading": false,
    "isLoaded": false
  });

  let promise = query.load();

  assert.deepEqual(query.getProperties('isLoading', 'isLoaded'), {
    "isLoading": true,
    "isLoaded": false
  });

  await promise;

  assert.deepEqual(query.getProperties('isLoading', 'isLoaded'), {
    "isLoading": false,
    "isLoaded": true
  });

  assert.deepEqual(query.get('content').mapBy('name'), [
    "green",
    "red",
    "yellow"
  ]);
});
