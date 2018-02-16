import EmberObject from '@ember/object';
import InternalObject from '../model/data/internal-object';

export default EmberObject.extend({

  context: null,

  _createInternalObject(parent) {
    let context = this.get('context');
    return new InternalObject(context, parent);
  },

  _deserializeInternalObject(internal, json) {
    internal.deserialize(json);
    return internal;
  },

  createObject(json) {
    let internal = this._createInternalObject();
    return this._deserializeInternalObject(internal, json).model(true);
  },

  updateObject(object, json) {
    let internal = object._internal;
    return this._deserializeInternalObject(internal, json).model(true);
  }

});
