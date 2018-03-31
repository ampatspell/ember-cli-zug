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

test('anonymous method exists', async function(assert) {
  let anon = this.store.get('auth.methods.anonymous');
  assert.ok(anon);
  assert.ok(anon.get('type') === 'anonymous');
});

test('anonymous method is destroyed on destroy', async function(assert) {
  let anon = this.store.get('auth.methods.anonymous');
  run(() => this.store.destroy());
  assert.ok(anon.isDestroyed);
});

test('available auth method names', async function(assert) {
  assert.deepEqual(this.store.get('auth.methods.available'), [
    'anonymous'
  ]);
});

test('sign out', async function(assert) {
  let promise = this.store.get('auth').signOut();
  assert.ok(promise);
  let result = await promise;
  assert.ok(result === undefined);
});

test('sign in anonymously', async function(assert) {
  let auth = this.store.get('auth');
  await auth.signOut();
  let anon = auth.get('methods.anonymous');
  let result = await anon.signIn();
  console.log(result);
  assert.ok(auth.get('user'));
});
