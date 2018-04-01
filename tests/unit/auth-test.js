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
    'anonymous',
    'email'
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
  let user = auth.get('user');
  assert.ok(user.get('isAnonymous'));
  assert.ok(result === user);
});

test('sign in anonymously out and in again', async function(assert) {
  let auth = this.store.get('auth');
  await auth.signOut();

  let anon = auth.get('methods.anonymous');

  await anon.signIn();
  let first = auth.get('user');

  await auth.signOut();

  await anon.signIn();
  let second = auth.get('user');

  assert.ok(first !== second);

  assert.ok(first.isDestroying);
  assert.ok(!second.isDestroying);
});

test('sign in with email', async function(assert) {
  let auth = this.store.get('auth');
  await auth.signOut();
  let method = auth.get('methods.email');
  let result = await method.signIn('ampatspell@gmail.com', 'hello-world');
  let user = auth.get('user');
  assert.equal(user.get('isAnonymous'), false);
  assert.equal(user.get('email'), 'ampatspell@gmail.com');
  assert.ok(result === user);
});

test('delete account', async function(assert) {
  let auth = this.store.get('auth');
  await auth.signOut();

  let anon = auth.get('methods.anonymous');
  await anon.signIn();

  let user = auth.get('user');

  await user.delete();

  assert.ok(!auth.get('user'));
});

test.only('sign up with email and delete', async function(assert) {
  let auth = this.store.get('auth');
  await auth.signOut();

  let method = auth.get('methods.email');

  let signup = await method.signUp('ampatspell+test@gmail.com', 'hello-world');
  let user = auth.get('user');

  assert.ok(user);
  assert.ok(signup === user);
  assert.equal(user.get('email'), 'ampatspell+test@gmail.com');

  await user.delete();

  user = auth.get('user');
  assert.ok(!user);

  try {
    await method.signIn('ampatspell+test@gmail.com', 'hello-world');
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.equal(err.code, 'auth/user-not-found');
  }
});
