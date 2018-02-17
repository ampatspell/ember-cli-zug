import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { all } from 'rsvp';
import QueryObserver from 'models/-private/model/query-observer';
import { waitFor, recreateCollection, waitForLength } from '../helpers/runloop';

module('query-observer', {
  async beforeEach() {
    await recreateCollection(this.firestore.collection('ducks'), [
      { name: 'yellow' },
      { name: 'green' },
      { name: 'red' }
    ]);
  }
});

test('hello', async function(assert) {
  let coll = this.firestore.collection('ducks');

  let observer = new QueryObserver(coll.orderBy('name'));

  await observer.promise;

  assert.deepEqual(observer.content.mapBy('name'), [
    "green",
    "red",
    "yellow"
  ]);

  let [ brown, magenta ] = await all([
    coll.add({ name: 'brown' }),
    coll.add({ name: 'magenta' })
  ]);

  await waitForLength(observer.content, 5);

  assert.deepEqual(observer.content.mapBy('name'), [
    "brown",
    "green",
    "magenta",
    "red",
    "yellow"
  ]);

  let green = observer.content.findBy('name', 'green');

  await all([
    green.ref.delete(),
    brown.set({ name: 'white' }),
    magenta.set({ name: 'pink' })
  ]);

  await waitForLength(observer.content, 4);

  assert.deepEqual(observer.content.mapBy('name'), [
    "pink",
    "red",
    "white",
    "yellow"
  ]);

  observer.destroy();
});
