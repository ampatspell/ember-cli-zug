import Internal from '../internal';
import { typeOf } from '@ember/utils';
import {
  toInternal,
  isInternal,
  isInternalObject
} from './util';

export default class InternalData extends Internal {

  constructor(context, parent, content) {
    super(context);
    this.parent = parent;
    this.content = content;
  }

  detach() {
    this.parent = null;
  }

  attach(parent) {
    this.parent = parent;
  }

  get isDetached() {
    return !this.parent;
  }

  get manager() {
    return this.context._internal.data;
  }

  //

  _createInternalObject(parent) {
    return this.manager._createInternalObject(parent);
  }

  _detachInternal(value) {
    if(!isInternal(value)) {
      return;
    }
    value.detach();
  }

  _attachInternal(value) {
    if(!isInternal(value)) {
      return;
    }
    value.attach(this);
  }

  _deserializePrimitiveValue(value, current) {
    this._detachInternal(current);
    return { update: true, internal: value };
  }

  _deserializeObjectValue(value, current) {
    let update;
    let internal;
    if(isInternalObject(current)) {
      internal = current;
      internal.deserialize(value);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalObject(this);
      internal.deserialize(value);
      update = true;
    }
    return { update, internal };
  }

  _deserializeInternalObjectValue(value, current) {
    this._detachInternal(current);
    this._attachInternal(value);
    return { update: true, internal: value };
  }

  _deserializeValue(value, current) {
    value = toInternal(value);

    if(current === value) {
      return {
        update: false,
        internal: value
      };
    }

    if(isInternal(value)) {
      if(value.isDetached) {
        if(isInternalObject(value)) {
          return this._deserializeInternalObjectValue(value, current);
        } else {
          console.log('internal detached non-object', value);
          return;
        }
      }
      value = value.serialize();
    }

    let type = typeOf(value);

    if(type === 'instance') {
      if(typeof value.toJSON === 'function') {
        value = value.toJSON();
      } else {
        value = undefined;
      }
      type = typeOf(value);
    }

    if(type === 'object') {
      return this._deserializeObjectValue(value, current);
    } else if(type === 'array') {
      console.log('value is array', value);
    } else {
      return this._deserializePrimitiveValue(value, current);
    }
  }

  _serializeValue(value) {
    if(isInternal(value)) {
      value = value.serialize();
    }
    return value;
  }

}
