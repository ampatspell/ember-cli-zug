import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import DataObject from 'models/-private/model/data/object';
import InternalPrimitive from 'models/-private/model/data/internal-primitive';

module('document-data', {
  beforeEach() {
    this.manager = this.store._internal.data;
  }
});

test('manager exists', function(assert) {
  assert.ok(this.manager);
});

test('create from empty object', function(assert) {
  let object = this.manager.create({});
  assert.ok(object);
  assert.ok(DataObject.detectInstance(object));
});

test('create from object', function(assert) {
  let object = this.manager.create({ message: 'hey there' });
  assert.ok(object._internal.content.message instanceof InternalPrimitive);
  assert.equal(object.get('message'), 'hey there');
});

test('create from nested objects', function(assert) {
  let object = this.manager.create({ message: { caption: 'hey there' } });
  let message = object.get('message');
  assert.ok(DataObject.detectInstance(object));
  assert.ok(DataObject.detectInstance(message));
  assert.equal(object.get('message.caption'), 'hey there');
});

test('update object primitive value', function(assert) {
  let object = this.manager.create({ message: 'hey there' });
  let internal = object._internal.content.message;
  object.set('message', 'nice to meet you');
  assert.equal(object.get('message'), 'nice to meet you');
  assert.equal(object._internal.content.message.content, 'nice to meet you');
  assert.ok(internal === object._internal.content.message);
});
