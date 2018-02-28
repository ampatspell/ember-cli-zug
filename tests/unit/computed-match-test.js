import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { id } from 'models/model/persisted/computed';
import { match } from 'models/computed';

const Duck = PersistedModel.extend({
  id: id(),
  friend: match({
    type: 'single',
    owner: [ 'doc.id' ],
    model: [ 'doc.data.friendId' ],
    matches(model, owner) {
      return model.get('doc.data.friendId') === owner.get('id');
    }
  }),
  friends: match({
    type: 'array',
    owner: [ 'doc.id' ],
    model: [ 'doc.data.friendId' ],
    matches(model, owner) {
      return model.get('doc.data.friendId') === owner.get('id');
    }
  })
});

module('computed-match', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
  }
});

test('initial single match', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: 'green' } });
  let green = this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });

  assert.ok(green.get('friend') === yellow);
});

test('single match', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: {} });
  let green = this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });

  assert.ok(green.get('friend') === null);

  yellow.set('doc.data.friendId', 'green');
  assert.ok(green.get('friend') === yellow);
});

test('array match', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: {} });
  let green = this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });
  let red = this.store.model({ name: 'duck', id: 'red', collection: 'ducks', data: {} });

  assert.deepEqual(red.get('friends').mapBy('id'), []);

  yellow.set('doc.data.friendId', 'red');
  assert.deepEqual(red.get('friends').mapBy('id'), [ 'yellow' ]);

  green.set('doc.data.friendId', 'red');
  assert.deepEqual(red.get('friends').mapBy('id'), [ 'yellow', 'green' ]);

  yellow.set('doc.data.friendId', null);
  assert.deepEqual(red.get('friends').mapBy('id'), [ 'green' ]);
});
