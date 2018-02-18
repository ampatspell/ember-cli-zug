import EmberObject from '@ember/object';
import InternalObject from '../model/data/internal-object';
import InternalArray from '../model/data/internal-array';

export default EmberObject.extend({

  context: null,

  _deserializeInternal(internal, json, notify) {
    internal.withPropertyChanges(notify, changed => internal.deserialize(json, changed));
    return internal;
  },

  _createInternalObject(parent, json) {
    let context = this.get('context');
    let internal = new InternalObject(context, parent);
    this._deserializeInternal(internal, json, false);
    return internal;
  },

  _createInternalArray(parent, json) {
    let context = this.get('context');
    let internal = new InternalArray(context, parent);
    this._deserializeInternal(internal, json, false);
    return internal;
  },

  createInternalObject(json) {
    return this._createInternalObject(null, json);
  },

  createObject(json) {
    return this.createInternalObject(json).model(true);
  },

  createArray(json) {
    return this._createInternalArray(null, json).model(true);
  },

  updateObject(object, json) {
    let internal = object._internal;
    this._deserializeInternal(internal, json, true);
    return internal.model(true);
  }

});
