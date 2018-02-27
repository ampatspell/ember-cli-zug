import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection } from '../helpers/runloop';
import PersistedModel from 'models/model/persisted';
import { id, attr } from 'models/model/persisted/computed';
import { match } from 'models/model/computed';

const Duck = PersistedModel.extend({
  id: id(),
  friend: match({
    owner: [ 'doc.id' ],
    model: [ 'doc.friendId' ]
  })
});

module('match', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
  }
});

test.skip('hello', function(assert) {
  let yellow = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: { friendId: 'green' } });
  assert.ok(!yellow.get('friend'));

  let green = this.store.model({ name: 'duck', id: 'yellow', collection: 'ducks', data: {} });
  assert.ok(yellow.get('friend') === green);
});
