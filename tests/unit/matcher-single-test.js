import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { id } from 'models/model/persisted/computed';

const Duck = PersistedModel.extend({
  id: id()
});

module('matcher-single', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
    this.create = opts => this.store._internal.matchersManager.createInternalMatcher(opts);
  }
});

test('match and rematch single', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: null } });
  let green = this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });

  let log = [];

  let matcher = this.create({
    type: 'single',
    model: [ 'doc.data.friendId' ],
    matches(model) {
      return model.get('doc.data.friendId') === 'green'
    },
    didUpdate() {
      log.push('didUpdate');
    }
  });

  assert.ok(matcher.content === null);

  yellow.set('doc.data.friendId', 'green');

  assert.ok(matcher.content === yellow);
  assert.deepEqual(log, [
    'didUpdate'
  ]);

  yellow.set('doc.data.friendId', null);

  assert.ok(matcher.content === null);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate'
  ]);

  yellow.set('doc.data.friendId', 'green');

  assert.ok(matcher.content === yellow);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate',
    'didUpdate'
  ]);

  green.set('doc.data.friendId', 'green');

  assert.ok(matcher.content === yellow);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate',
    'didUpdate'
  ]);

  yellow.set('doc.data.friendId', null);

  assert.ok(matcher.content === green);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate'
  ]);

  green.set('doc.data.friendId', null);

  assert.ok(matcher.content === null);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate'
  ]);

  let red = this.store.model({ name: 'duck', id: 'red', collection: 'ducks', data: { friendId: 'green' } });

  assert.ok(matcher.content === red);
  assert.deepEqual(log, [
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate',
    'didUpdate'
  ]);
});

test('initial match single', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: 'green' } });
  this.store.model({ name: 'duck', id: 'green', collection: 'ducks', data: {} });

  let log = [];

  let matcher = this.create({
    type: 'single',
    model: [ 'doc.data.friendId' ],
    matches(model) {
      return model.get('doc.data.friendId') === 'green'
    },
    didUpdate() {
      log.push('didUpdate');
    }
  });

  assert.ok(matcher.content === yellow);
  assert.deepEqual(log, []);
});
