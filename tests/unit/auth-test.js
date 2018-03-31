import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { run } from '@ember/runloop';

module('auth');

test('auth exists', async function(assert) {
  let auth = this.store.get('auth');
  assert.ok(auth);
});

test('auth is shared between contexts', async function(assert) {
  let root = this.store.get('auth');
  let nested = this.store.nest('foo').get('auth');
  assert.ok(root === nested);
});

test('auth is destroyed on context destroy', async function(assert) {
  let auth = this.store.get('auth');
  run(() => this.store.destroy());
  assert.ok(auth.isDestroyed);
});

test('auth has methods', async function(assert) {
  let auth = this.store.get('auth');
  assert.ok(auth.get('methods'));
});

test('methods are destroyed', async function(assert) {
  let auth = this.store.get('auth');
  let methods = auth.get('methods');
  run(() => this.store.destroy());
  assert.ok(methods.isDestroyed);
});
