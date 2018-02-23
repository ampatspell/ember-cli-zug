import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';
import { recreateCollection } from '../helpers/runloop';

const Duck = PersistedModel.extend();
const Hamster = PersistedModel.extend();
const YellowDuck = Duck.extend();

module('model-load', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll, [
      { __name__: 'yellow', name: 'yellow' }
    ]);
    this.register('model:duck', Duck);
    this.register('model:yellow-duck', YellowDuck);
    this.register('model:hamster', Hamster);
  }
});

test.skip('hello', function() {
});

// context.load({ path: 'ducks/yellow' }) => Model
// context.load({ collection: 'ducks', query: q => q.doc('asd') }) => Model
// context.load({ collection: 'ducks' }) => Array
// context.load({ collection: 'foo/bar/baz', query: q => q.limit(1) }) => Array
// context.load({ query: q => q.collection('foo').limit(1) }) => Array

// context.first({ path: 'ducks/yellow' }) => Model
