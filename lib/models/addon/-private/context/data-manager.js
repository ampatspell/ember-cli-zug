import EmberObject from '@ember/object';
import { typeOf } from '@ember/utils';
import InternalPrimitive from '../model/data/internal-primitive';
import InternalObject from '../model/data/internal-object';

export default EmberObject.extend({

  context: null,

  _createInternalPrimitive() {
    let context = this.get('context');
    return new InternalPrimitive(context);
  },

  _createInternalObject() {
    let context = this.get('context');
    return new InternalObject(context);
  },

  _createInternal(value) {
    let internal;
    let context = this.get('context');
    let type = typeOf(value);
    if(type === 'object') {
      internal = this._createInternalObject();
    } else {
      internal = this._createInternalPrimitive();
    }
    internal.deserialize(value);
    return internal;
  },

  create(value) {
    let internal = this._createInternal(value);
    return internal.model(true);
  }

});
