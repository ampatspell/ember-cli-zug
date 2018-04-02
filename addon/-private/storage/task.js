import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';
import { InternalMixin, prop, propertiesMixin, serialized, modelprop } from '../model/internal';

export const keys = [
  'downloadURL',
  'bytesTransferred',
  'totalBytes'
];

let task = [
  'type',
  'percent',
  'isRunning',
  'isCompleted',
  'isError',
  'error'
];

let SnapshotPropertiesMixin = propertiesMixin('snapshot', keys);

let TaskPropertiesMixin = Mixin.create(task.reduce((props, key) => {
  props[key] = prop();
  return props;
}, {}));

export default EmberObject.extend(InternalMixin, SnapshotPropertiesMixin, TaskPropertiesMixin, {

  reference: modelprop(),

  promise: prop(),

  serialized: serialized([ ...task, ...keys ])

});
