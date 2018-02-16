import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';

module('sanity');

test('hello', function(assert) {
  assert.ok(this.application);
  assert.ok(this.instance);
  assert.ok(this.store);
});

test('firebase is configured', function(assert) {
  let store = this.store;
  assert.ok(store.firebase);
  assert.ok(store.firestore);
});

test('firestore load', async function(assert) {
  let firestore = this.store.firestore;
  let result = await firestore.collection('non-existant').get();
  assert.ok(result);
  assert.ok(result.docs);
  assert.equal(result.size, 0);
});
