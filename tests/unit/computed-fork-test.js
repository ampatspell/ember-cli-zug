import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import TransientModel from 'models/model/transient';
import { fork } from 'models/model/computed';
import { run } from '@ember/runloop';
import { recreateCollection } from '../helpers/runloop';

const Thing = TransientModel.extend({
});

const State = TransientModel.extend({

  name: 'foobar',

  forked: fork(function() {
    return {
      context: 'context',
      owner: [ 'name' ],
      name: this.get('name')
    };
  }),

});

module('computed-fork', {
  async beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);

    this.modelNameForDocument = () => 'duck';
    this.register('model:state', State);
    this.register('model:thing', Thing);
  }
});

test('create', function(assert) {
  let model = this.store.model({ name: 'state' });
  let forked = model.get('forked');
  assert.ok(forked);
  assert.equal(forked.get('absoluteIdentifier'), 'store/foobar');
});

test('observes owner', function(assert) {
  let model = this.store.model({ name: 'state' });
  let first = model.get('forked');
  assert.ok(first);
  assert.equal(first.get('absoluteIdentifier'), 'store/foobar');

  run(() => model.set('name', 'another'));

  let second = model.get('forked');
  assert.ok(second);
  assert.equal(second.get('absoluteIdentifier'), 'store/another');
});

test('destroy created', function(assert) {
  let model = this.store.model({ name: 'state' });
  let first = model.get('forked');
  run(() => first.destroy());
  let second = model.get('forked');
  assert.ok(first !== second);
  assert.ok(first.isDestroyed);
  assert.ok(!second.isDestroyed);
});

test('owner destroy destroys forked', async function(assert) {
  let model = this.store.model({ name: 'state' });
  let first = model.get('forked');
  run(() => model.destroy());
  await first.settle();
  assert.ok(first.isDestroyed);
});

test('owner destroy destroys forked after settle', async function(assert) {
  await this.recreate();

  let model = this.store.model({ name: 'state' });
  let context = model.get('forked');

  let duck = context.model({ name: 'duck', collection: 'ducks', id: 'yellow', data: { name: 'yellow' } });

  duck.get('doc').save();

  run(() => model.destroy());

  assert.ok(!context.isDestroyed);
  assert.ok(!duck.isDestroyed);

  await context.settle();

  assert.ok(context.isDestroyed);
  assert.ok(duck.isDestroyed);

  let doc = await this.coll.doc('yellow').get();
  assert.deepEqual(doc.data(), {
    "name": "yellow"
  });
});
