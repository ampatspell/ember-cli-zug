import EmberObject, { computed } from '@ember/object';
import { InternalMixin, propertiesMixin, serialized } from '../model/internal';

let keys = [
  'bucket',
  'fullPath',
  'name'
];

let PropertiesMixin = propertiesMixin('ref', keys);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  serialized: serialized(keys)

});
