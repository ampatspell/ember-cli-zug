import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'ember-cli-zug/model/persisted';
import { id } from 'ember-cli-zug/model/persisted/computed';

const Duck = PersistedModel.extend({
  id: id()
});

module('matcher-array', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
    this.create = opts => this.store._internal.matchersManager.createInternalMatcher(opts);
  }
});

test('match and rematch array', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: null } });
  let green = this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: { friendId: null } });

  let matcher = this.create({
    type: 'array',
    model: [ 'doc.data.friendId' ],
    matches(model) {
      return model.get('doc.data.friendId') === 'green'
    }
  });

  let content = matcher.content;

  assert.deepEqual(content.mapBy('id'), []);

  yellow.set('doc.data.friendId', 'green');
  assert.deepEqual(content.mapBy('id'), [ 'yellow' ]);

  green.set('doc.data.friendId', 'green');
  assert.deepEqual(content.mapBy('id'), [ 'yellow', 'green' ]);

  this.store.model({ name: 'duck', id: 'red', collection: 'ducks', data: { friendId: 'green' } });

  assert.deepEqual(content.mapBy('id'), [ 'yellow', 'green', 'red' ]);
});

test('initial match array', function(assert) {
  this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: 'green' } });
  this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });

  let matcher = this.create({
    type: 'array',
    model: [ 'doc.data.friendId' ],
    matches(model) {
      return model.get('doc.data.friendId') === 'green'
    }
  });

  assert.deepEqual(matcher.content.mapBy('id'), [ 'yellow' ]);
});
