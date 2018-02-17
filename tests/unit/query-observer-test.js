import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { all } from 'rsvp';
import QueryObserver from 'models/-private/model/query-observer';
import { waitFor } from '../helpers/runloop';

const waitForCollectionSize = (coll, size) => waitFor(async () => (await coll.get()).size === size);

module('query-observer', {
  beforeEach() {
    this.recreate = async () => {
      let coll = this.firestore.collection('ducks');
      let snapshot = await coll.get();
      await all([
        ...snapshot.docs.map(doc => doc.ref.delete()),
        coll.add({ name: 'yellow' }),
        coll.add({ name: 'green' }),
        coll.add({ name: 'red' })
      ]);
      await waitForCollectionSize(coll, 3);
    };
    this.create = query => {
      return new QueryObserver(query, {
      });
    };
  }
});

test('hello', async function(assert) {
  await this.recreate();
  let coll = this.firestore.collection('ducks');

  let observer = new QueryObserver(coll.orderBy('name'));
  let len = expected => waitFor(() => observer.content.get('length') === expected);

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

  await len(5);

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

  await len(4);

  assert.deepEqual(observer.content.mapBy('name'), [
    "pink",
    "red",
    "white",
    "yellow"
  ]);

  observer.destroy();
});
