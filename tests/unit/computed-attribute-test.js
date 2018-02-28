import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { attr } from 'models/model/persisted/computed';
import { recreateCollection } from '../helpers/runloop';

const Duck = PersistedModel.extend({

  name:      attr({ type: 'string' }),
  email:     attr({ type: 'string' }),
  isNice:    attr({ key: 'is_nice', type: 'boolean' }),
  createdAt: attr({ key: 'created_at', type: 'timestamp' }),
  address:   attr({ type: 'string' }),

  customKey: 'name',
  custom: attr(function() {
    return {
      owner: [ 'customKey' ],
      key: this.get('customKey')
    };
  }),

});

module('computed-attribute', {
  async beforeEach() {
    this.now = new Date();
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      {
        __name__: 'yellow',
        name: 'yellow',
        email: 'yellow@gmail.com',
        is_nice: true,
        created_at: this.now
      }
    ]);
    this.register('model:duck', Duck);
    this.modelNameForDocument = () => 'duck';
  }
});

test('load', async function(assert) {
  await this.recreate();
  let model = await this.store.load({ collection: 'ducks', id: 'yellow' });
  assert.equal(model.get('name'), 'yellow');
  assert.equal(model.get('email'), 'yellow@gmail.com');
  assert.equal(model.get('isNice'), true);
  assert.equal(model.get('createdAt').getTime(), this.now.getTime());
  assert.equal(model.get('address'), null);
});

test('mutate', async function(assert) {
  let model = this.store.model({ name: 'duck', data: { name: 'yellow' } });

  assert.equal(model.get('name'), 'yellow');

  let result = model.set('name', 'green');
  assert.equal(result, 'green');

  assert.equal(model.get('name'), 'green');
  assert.equal(model.get('doc.data.name'), 'green');
});

test('custom attr key', async function(assert) {
  let model = this.store.model({ name: 'duck', data: { name: 'yellow', email: 'yellow@gmail.com' } });
  assert.equal(model.get('custom'), 'yellow');
  model.set('customKey', 'email');
  assert.equal(model.get('custom'), 'yellow@gmail.com');
});
