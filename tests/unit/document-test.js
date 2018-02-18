import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import { recreateCollection, waitForCollectionSize } from '../helpers/runloop';

module('document', {
  beforeEach() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
    this.create = props => this.store._internal.documents.createNewDocument(props);
  }
});

test('hello', function(assert) {
  assert.ok(true);
});
