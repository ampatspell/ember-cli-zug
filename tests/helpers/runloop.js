import { get } from '@ember/object';
import { later } from '@ember/runloop';
import { Promise, all } from 'rsvp';

export const wait = delay => new Promise(resolve => later(resolve, delay));

export const waitFor = async (fn, max=30000) => {
  let start = Date.now();
  for(;;) {
    if(Date.now() - start > max) {
      throw new Error('Timeout');
    }
    let done = await fn();
    if(done) {
      return;
    }
    await wait(100);
  }
};

export const waitForCollectionSize = (coll, size) => waitFor(async () => (await coll.get()).size === size);

export const recreateCollection = async (coll, docs) => {
  let snapshot = await coll.get();
  await all(snapshot.docs.map(doc => doc.ref.delete()));
  await waitForCollectionSize(coll, 0);
  await all(docs.map(doc => coll.add(doc)));
  await waitForCollectionSize(coll, docs.length);
};

export const waitForProp = (object, prop, value) => waitFor(async () => get(object, prop) === value);
export const waitForLength = (array, length) => waitForProp(array, 'length', length);
