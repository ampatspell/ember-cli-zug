import Internal from '../internal';
import { typeOf } from '@ember/utils';

export default class InternalData extends Internal {

  constructor(context, parent, content) {
    super(context);
    this.parent = parent;
    this.content = content;
  }

  get manager() {
    return this.context._internal.data;
  }

  toModel(value) {
    if(value instanceof InternalData) {
      return value.model(true);
    }
    return value;
  }

  isInternal(value) {
    return value instanceof InternalData;
  }

  toInternal(value) {
    let internal = value && value._internal;
    if(this.isInternal(internal)) {
      return internal;
    }
    return value;
  }

}
