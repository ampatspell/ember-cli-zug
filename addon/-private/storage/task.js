import EmberObject from '@ember/object';
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
let TaskPropertiesMixin = propertiesMixin(null, task);

export default EmberObject.extend(InternalMixin, SnapshotPropertiesMixin, TaskPropertiesMixin, {

  reference: modelprop(),

  promise: prop(),

  serialized: serialized([ ...task, ...keys ])

});
