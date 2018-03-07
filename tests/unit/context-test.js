import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'models/model/persisted';

const Duck = PersistedModel.extend();

module('context', {
  async beforeEach() {
    this.register('model:duck', Duck);
    this.modelNameForDocument = () => 'duck';
  }
});

test('has model class for name', function(assert) {
  assert.ok(!this.store.hasModelClassForName('thing'));
  assert.ok(this.store.hasModelClassForName('duck'));
  try {
    this.store.hasModelClassForName('');
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.equal(err.message, 'Assertion Failed: model name must not be blank');
  }
});
