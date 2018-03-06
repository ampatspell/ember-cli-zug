import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import TransientModel from 'models/model/transient';
import { transient } from 'models/model/computed';
import { run } from '@ember/runloop';

const Thing = TransientModel.extend({
});

const State = TransientModel.extend({

  name: 'foobar',

  basic: transient({
    context: 'context',
    owner: [ 'name' ],
    create(owner) {
      let name = owner.get('name');
      return { name: 'thing', data: { name } };
    }
  }),

});

module('computed-transient', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:state', State);
    this.register('model:thing', Thing);
  }
});

test('create', function(assert) {
  let model = this.store.model({ name: 'state' });
  let basic = model.get('basic');
  assert.ok(basic);
  assert.ok(Thing.detectInstance(basic));
  assert.equal(basic.get('name'), 'foobar');
});

test('recreate on prop change', function(assert) {
  let model = this.store.model({ name: 'state' });

  let first = model.get('basic');
  assert.ok(!first.isDestroyed);
  assert.equal(first.get('name'), 'foobar');

  run(() => model.set('name', 'yellow'));

  assert.ok(first.isDestroyed);

  let second = model.get('basic');
  assert.ok(!second.isDestroyed);
  assert.equal(second.get('name'), 'yellow');
});

test('model is destroyed on parent destroy', function(assert) {
  let model = this.store.model({ name: 'state' });
  let basic = model.get('basic');
  assert.ok(basic);

  run(() => model.destroy());

  assert.ok(basic.isDestroyed);
});
