import EmberObject, { computed } from '@ember/object';
import { InternalMixin, prop, propertiesMixin, serialized } from '../model/internal';

let keys = [
];

let serializedKeys = [ 'type', ...keys ];

let PropertiesMixin = propertiesMixin('task', keys);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  type: prop('type'),

  serialized: serialized(serializedKeys),

  promise: prop('promise')

});
