import Destroyable from '../model/destroyable';
import InternalObject from '../model/data/internal-object';
import InternalArray from '../model/data/internal-array';

export default class DataManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
  }

  _deserializeInternal(internal, json, notify) {
    internal.withPropertyChanges(notify, changed => internal.deserialize(json, changed));
    return internal;
  }

  createInternalArray(parent, json) {
    let internal = new InternalArray(this.context, parent);
    this._deserializeInternal(internal, json, false);
    return internal;
  }

  createInternalObject(parent, json) {
    let internal = new InternalObject(this.context, parent);
    this._deserializeInternal(internal, json, false);
    return internal;
  }

  updateInternalObject(internal, json) {
    this._deserializeInternal(internal, json, true);
    return internal;
  }

}
