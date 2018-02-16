import EmberObject from '@ember/object';
import InternalObject from '../model/data/internal-object';
import InternalArray from '../model/data/internal-array';

export default EmberObject.extend({

  context: null,

  _createInternalObject(parent) {
    let context = this.get('context');
    return new InternalObject(context, parent);
  },

  _createInternalArray(parent) {
    let context = this.get('context');
    return new InternalArray(context, parent);
  },

  _deserializeInternal(internal, json, notify) {
    internal.withPropertyChanges(notify, changed => internal.deserialize(json, changed));
    return internal;
  },

  createObject(json) {
    let internal = this._createInternalObject();
    this._deserializeInternal(internal, json, false);
    return internal.model(true);
  },

  updateObject(object, json) {
    let internal = object._internal;
    this._deserializeInternal(internal, json, true);
    return internal.model(true);
  }

});
