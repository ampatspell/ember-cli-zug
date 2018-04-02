import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { run } from '@ember/runloop';

module('storage', {
  beforeEach() {
    this.storage = this.store.get('storage');
    this.signIn = () => this.store.get('auth.methods.anonymous').signIn();

    this.ref = this.storage.ref({ path: 'hello' });

    this.put = string => this.ref.put({
      type: 'string',
      data: string || 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      }
    });
  }
});

test('storage exists', async function(assert) {
  let storage = this.store.get('storage');
  assert.ok(storage);
});

test('storage is not shared between contexts', async function(assert) {
  let root = this.store.get('storage');
  let nested = this.store.nest('foo').get('storage');
  assert.ok(nested);
  assert.ok(root !== nested);
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
  let bucket = ref.get('bucket');
  assert.equal(bucket, this.store.get('app').options.storageBucket);
  assert.deepEqual(ref.get('serialized'), {
    "bucket": bucket,
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

test('settle', async function(assert) {
  await this.signIn();
  let task = this.put();

  await this.store.settle();

  assert.ok(task.get('isCompleted'));
  assert.ok(this.storage.get('tasks.length') === 0);
});

test('running tasks are registered in storage', async function(assert) {
  await this.signIn();
  let tasks = this.storage.get('tasks');

  assert.ok(tasks.get('length') === 0);

  let task = this.put();

  assert.ok(tasks.get('length') === 1);
  assert.ok(tasks.includes(task));

  await task.get('promise');

  assert.ok(tasks.get('length') === 0);
});

test('task has ref', async function(assert) {
  await this.signIn();
  let task = this.put();
  assert.ok(task.get('reference') === this.ref);
});

test('task properties', async function(assert) {
  await this.signIn();
  let task = this.put();

  assert.deepEqual(task.get('serialized'), {
    "bytesTransferred": 0,
    "downloadURL": null,
    "error": null,
    "isCompleted": false,
    "isError": false,
    "isRunning": true,
    "percent": 0,
    "totalBytes": 27,
    "type": "string"
  });

  await task.get('promise');

  let downloadURL = task.get('downloadURL');
  assert.ok(downloadURL.includes('https://firebasestorage.googleapis.com'));
  assert.deepEqual(task.get('serialized'), {
    "bytesTransferred": 27,
    "downloadURL": downloadURL,
    "error": null,
    "isCompleted": true,
    "isError": false,
    "isRunning": false,
    "percent": 100,
    "totalBytes": 27,
    "type": "string"
  });
});

test('destroy nested context while uploading', async function(assert) {
  await this.signIn();

  let nested = this.store.nest('nested');
  let ref = nested.get('storage').ref({ path: 'hello' });
  let task = ref.put({ type: 'string', data: 'hey', format: 'raw', metadata: { contentType: 'text/plain' } });

  run(() => nested.destroy());

  assert.ok(task.isDestroyed);
});
