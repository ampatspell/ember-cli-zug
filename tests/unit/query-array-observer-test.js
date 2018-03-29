import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { all } from 'rsvp';
import QueryArrayObserver from 'models/-private/model/observer/query-array-observer';
import { recreateCollection, waitForLength } from '../helpers/runloop';
import { assign } from '@ember/polyfills';

module('query-array-observer', {
  async beforeEach() {
    await recreateCollection(this.firestore.collection('ducks'), [
      { name: 'yellow' },
      { name: 'green' },
      { name: 'red' }
    ]);
    let delegate = [];
    this.delegate = delegate;
    this.create = query => new QueryArrayObserver(this.store._internal, query, {
      onMetadata() {},
      createModel(doc) {
        let data = doc.data();
        delegate.push(`create: ${data.name}`);
        return assign({ ref: doc.ref }, data);
      },
      updateModel(model, doc) {
        let data = doc.data();
        delegate.push(`update: ${model.name} => ${data.name}`);
        return assign({ ref: doc.ref }, doc.data());
      },
      destroyModel(model) {
        delegate.push(`destroy: ${model.name}`);
      }
    });
  }
});

test('hello', async function(assert) {
  let coll = this.firestore.collection('ducks');
  let observer = this.create(coll.orderBy('name'));
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

  assert.deepEqual(this.delegate, [
    "create: green",
    "create: red",
    "create: yellow",
    "create: brown",
    "create: magenta",
    "destroy: green",
    "update: brown => white",
    "update: magenta => pink",
    "destroy: pink",
    "destroy: red",
    "destroy: white",
    "destroy: yellow"
  ]);
});
