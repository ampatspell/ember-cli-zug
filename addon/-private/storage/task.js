import EmberObject, { computed } from '@ember/object';
import { InternalMixin, prop, propertiesMixin, serialized } from '../model/internal';

export const keys = [
  'downloadURL',
  'bytesTransferred',
  'totalBytes'
];

let serializedKeys = [
  'type',
  'percent',
  'isCompleted',
  'error',
  ...keys
];

// metadata

let PropertiesMixin = propertiesMixin('snapshot', keys);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  type: prop(),
  percent: prop(),
  isCompleted: prop(),
  error: prop(),

  serialized: serialized(serializedKeys),

  promise: prop('promise')

});
