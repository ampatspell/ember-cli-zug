import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import withPropertyChanges from 'ember-cli-zug/-private/util/with-property-changes';

class Model {
  constructor() {
    this.log = [];
  }
  beginPropertyChanges() {
    this.log.push('beginPropertyChanges');
  }
  notifyPropertyChange(key) {
    this.log.push(`notifyPropertyChange ${key}`);
  }
  endPropertyChanges() {
    this.log.push('endPropertyChanges');
  }
}

class Internal {
  constructor(model) {
    this._model = model;
  }
  model() {
    return this._model;
  }
}

module('with-property-changes', {
  beforeEach() {
    this.create = () => {
      let model = new Model();
      let internal = new Internal(model);
      return { internal, model };
    };
  }
});

test('throw in changed block', function(assert) {
  let { internal, model } = this.create();
  let result = 'nop';
  try {
    result = withPropertyChanges(internal, true, changed => {
      changed('name');
      throw new Error('die');
    });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.ok(result === 'nop');
    assert.deepEqual(model.log, [
      "beginPropertyChanges",
      "notifyPropertyChange name",
      "endPropertyChanges"
    ]);
  }
});

test('return', function(assert) {
  let { internal, model } = this.create();

  let result = withPropertyChanges(internal, true, changed => {
    changed('name');
    assert.deepEqual(changed.properties, [
      "name"
    ]);
    return 'hey';
  });

  assert.ok(result === 'hey');

  assert.deepEqual(model.log, [
    "beginPropertyChanges",
    "notifyPropertyChange name",
    "endPropertyChanges"
  ]);
});

test('do not notify', function(assert) {
  let { internal, model } = this.create();

  withPropertyChanges(internal, false, changed => {
    changed('name');
  });

  assert.deepEqual(model.log, []);
});

test('skip', function(assert) {
  let { internal, model } = this.create();

  withPropertyChanges(internal, true, changed => {
    changed('name');
    changed('email');
    assert.deepEqual(changed.properties, [
      "name",
      "email"
    ]);
  }, [ 'name' ]);

  assert.deepEqual(model.log, [
    "beginPropertyChanges",
    "notifyPropertyChange email",
    "endPropertyChanges"
  ]);
});
