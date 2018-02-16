import EmberObject from '@ember/object';
import { InternalMixin, prop, invoke } from '../internal';

export default EmberObject.extend(InternalMixin, {

  unknownProperty(key) {
    return this._internal.getModelForKey(key);
  },

  setUnknownProperty(key, value) {
    return this._internal.setModelForKey(key, value);
  },

  serialized: prop('serialized'),

  toJSON: invoke('serialize')

});
