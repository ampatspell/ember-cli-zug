import EmberObject, { computed } from '@ember/object';
import { InternalMixin, model, propertiesMixin, serialized } from '../model/internal';

let keys = [
  'bucket',
  'fullPath',
  'name'
];

let PropertiesMixin = propertiesMixin('ref', keys);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  serialized: serialized(keys),

  // { type: 'data', data: ..., metadata: { } }
  // { type: 'string', data: ..., format: 'raw' / 'base64' / 'base64-url' / 'data-url', metadata: {} }
  put: model('put')

});
