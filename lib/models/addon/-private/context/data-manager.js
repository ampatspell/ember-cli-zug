import EmberObject from '@ember/object';
import InternalObject from '../model/data/internal-object';

export default EmberObject.extend({

  context: null,

  _createInternalObject(parent) {
    let context = this.get('context');
    return new InternalObject(context, parent);
  },

  createObject(json) {
    let internal = this._createInternalObject();
    internal.deserialize(json);
    return internal.model(true);
  }

});
