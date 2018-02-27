import EmberObject from '@ember/object';
import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { run } from '@ember/runloop';
import destroyable from 'models/-private/util/destroyable-computed';

const Prop = EmberObject.extend();

module('destroyable-mutate', {
  beforeEach() {
    this.create = log => {
      return EmberObject.extend({
        id: 'one',
        prop: destroyable('id', {
          reusable() {
            return false;
          },
          create(key) {
            log.push(`create ${this.get('id')}`);
            return Prop.create({ owner: this, key, id: this.get('id') });
          },
          get(internal) {
            log.push(`get ${internal.get('id')}`);
            return internal;
          },
          set(internal, value) {
            log.push(`set ${internal.get('id')} ${value}`);
            return value;
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

test('set after create', function(assert) {
  let log = [];
  let model = this.create(log);

  model.set('prop', 'foo');

  model.set('id', 'two');

  run(() => model.set('prop', 'bar'));

  assert.deepEqual(log, [
    "create one",
    "set one foo",
    "destroy one",
    "create two",
    "set two bar"
  ]);
});

test('set creates', function(assert) {
  let log = [];
  let model = this.create(log);

  model.set('prop', 'foo');

  assert.deepEqual(log, [
    "create one",
    "set one foo"
  ]);
});
