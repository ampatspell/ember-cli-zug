import EmberObject from '@ember/object';
import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { run } from '@ember/runloop';
import destroyable from 'models/-private/util/destroyable-computed';

const Prop = EmberObject.extend();

module('destroyable', {
  beforeEach() {
    this.create = log => {
      return EmberObject.extend({
        id: 'one',
        prop: destroyable('id', {
          create(key) {
            log.push(`create ${this.get('id')}`);
            return Prop.create({ owner: this, key, id: this.get('id') });
          },
          get(internal) {
            log.push(`get ${internal.get('id')}`);
            return internal;
          },
          destroy(internal) {
            log.push(`destroy ${internal.get('id')}`);
            internal.destroy();
          }
        }),
        willDestroy() {
          log.push('willDestroy');
          this._super(...arguments);
        }
      }).create();
    };
  }
});

test('create, recreate and destroy', function(assert) {
  let log = [];
  let model = this.create(log);

  let one = model.get('prop');
  assert.ok(one);
  assert.ok(model.get('prop') === one);

  assert.equal(one.get('id'), 'one');
  assert.equal(one.get('key'), 'prop');
  assert.equal(one.get('owner'), model);

  model.set('id', 'two');

  let two = run(() => model.get('prop'));

  assert.ok(two);
  assert.equal(two.get('id'), 'two');
  assert.equal(two.get('key'), 'prop');
  assert.equal(two.get('owner'), model);

  assert.ok(one !== two);
  assert.ok(one.isDestroyed);

  run(() => model.destroy());

  assert.ok(two.isDestroyed);
  assert.ok(model.isDestroyed);

  assert.deepEqual(log, [
    "create one",
    "get one",
    "destroy one",
    "create two",
    "get two",
    "destroy two",
    "willDestroy"
  ]);
});

test('create and destroy', function(assert) {
  let log = [];
  let model = this.create(log);

  run(() => model.destroy());

  assert.deepEqual(log, [
    "willDestroy"
  ]);
});
