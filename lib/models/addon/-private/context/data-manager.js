import EmberObject from '@ember/object';
import InternalObject from '../model/data/internal-object';

export default EmberObject.extend({

  context: null,

  _createInternalObject(parent) {
    let context = this.get('context');
    return new InternalObject(context, parent);
  },

  _deserializeInternalObject(internal, json, notify) {
    internal.withPropertyChanges(notify, changed => internal.deserialize(json, changed));
    return internal;
  },

  createObject(json) {
    let internal = this._createInternalObject();
    this._deserializeInternalObject(internal, json, false);
    return internal.model(true);
  },

  updateObject(object, json) {
    let internal = object._internal;
    this._deserializeInternalObject(internal, json, true);
    return internal.model(true);
  }

});
