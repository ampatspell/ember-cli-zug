import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { run } from '@ember/runloop';

module('storage', {
  beforeEach() {
    this.storage = this.store.get('storage');
    this.signIn = () => this.store.get('auth.methods.anonymous').signIn();
  }
});

test('storage exists', async function(assert) {
  let storage = this.store.get('storage');
  assert.ok(storage);
});

test('storage is shared between contexts', async function(assert) {
  let root = this.store.get('storage');
  let nested = this.store.nest('foo').get('storage');
  assert.ok(root === nested);
});

test('storage is destroyed on context destroy', async function(assert) {
  let storage = this.store.get('storage');
  run(() => this.store.destroy());
  assert.ok(storage.isDestroyed);
});

test('create ref', async function(assert) {
  let ref = this.storage.ref({ path: 'hello' });
  assert.ok(ref);
  assert.ok(ref._internal);
  assert.deepEqual(ref.get('serialized'), {
    "bucket": "ember-cli-zug.appspot.com",
    "fullPath": "hello",
    "name": "hello"
  });
});

test('create ref from url', async function(assert) {
  let ref = this.storage.ref({ url: 'gs://foo/bar' });
  assert.ok(ref);
  assert.ok(ref._internal);
  assert.deepEqual(ref.get('serialized'), {
    "bucket": "foo",
    "fullPath": "bar",
    "name": "bar"
  });
});

test('put string', async function(assert) {
  await this.signIn();

  let ref = this.storage.ref({ path: 'hello' });

  // ref.put({ type: 'data', data: blob, metadata: {} });
  let task = ref.put({
    type: 'string',
    data: 'hello world as a raw string',
    format: 'raw',
    metadata: {
      contentType: 'text/plain',
      customMetadata: { ok: true }
    }
  });

  assert.ok(task);
  assert.equal(task.get('type'), 'string');

  let promise = task.get('promise');
  assert.ok(promise);

  await promise;
});

test('put blob', async function(assert) {
  await this.signIn();

  let ref = this.storage.ref({ path: 'hello' });

  let task = ref.put({
    type: 'data',
    data: new Blob([ 'hello world as a blob' ]),
    metadata: {
      contentType: 'text/plain',
      customMetadata: { ok: true }
    }
  });

  assert.ok(task);
  assert.equal(task.get('type'), 'data');

  let promise = task.get('promise');
  assert.ok(promise);

  await promise;
});

// register running tasks
// properties for task
// metadata model
