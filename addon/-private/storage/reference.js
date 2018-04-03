import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { InternalMixin, model, modelprop, propertiesMixin, serialized, promise } from '../model/internal';

let ref = [
  'bucket',
  'fullPath',
  'name'
];

let props = [];

let RefPropertiesMixin = propertiesMixin('ref', ref);
let PropertiesMixin = propertiesMixin(null, props);

let metadata = key => readOnly(`metadata.${key}`);

export default EmberObject.extend(InternalMixin, RefPropertiesMixin, PropertiesMixin, {

  metadata: modelprop(),

  url: metadata('downloadURL'),

  // { type: 'data', data: ..., metadata: { } }
  // { type: 'string', data: ..., format: 'raw' / 'base64' / 'base64-url' / 'data-url', metadata: {} }
  put: model('put'),

  load: promise('load'),

  serialized: serialized([ ...ref, ...props ]),

});
