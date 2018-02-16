import Internal from '../internal';
import { typeOf } from '@ember/utils';
import InternalPrimitive from './internal-primitive';

export default class InternalData extends Internal {

  constructor(context, content) {
    super(context);
    this.content = content;
  }

  get manager() {
    return this.context._internal.data;
  }

  internalToModel(value) {
    if(value instanceof InternalData) {
      return value.model(true);
    }
    return value;
  }

  _updatePrimitive(current, value) {

  }

  update(current, value) {
    let result;

    let type = typeOf(value);
    if(type === 'object') {

    } else {
      result = this._updatePrimitive(current, value);
    }

    return result;
  }

}
