import Internal from '../internal';
import { typeOf } from '@ember/utils';
import withPropertyChanges from '../../util/with-property-changes';
import {
  toInternal,
  isInternal,
  isInternalObject,
  isInternalArray
} from './util';

export const empty = { __empty__: '__empty__' };

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

  didUpdateChildInternalData(internal, notify) {
    this.withPropertyChanges(notify, changed => changed('serialized'));
  }

  didUpdate(notify) {
    let parent = this.parent;
    parent && parent.didUpdateChildInternalData(this, notify);
  }

  withPropertyChanges(notify, cb, skip) {
    let { result, updated } = withPropertyChanges(this, notify, changed => {
      let result = cb(changed);
      let updated = !!changed.properties.length;
      if(updated) {
        changed('serialized');
      }
      return { result, updated };
    }, skip);

    if(updated) {
      this.didUpdate(notify);
    }

    return result;
  }

  //

  _createInternalObjectWithData(parent, data) {
    let internal = this.manager._createInternalObject(parent);
    this.manager._deserializeInternal(internal, data, false);
    return internal;
  }

  _createInternalArrayWithData(parent, data) {
    let internal = this.manager._createInternalArray(parent);
    this.manager._deserializeInternal(internal, data, false);
    return internal;
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

  _deserializeObjectValue(value, current, changed) {
    let update;
    let internal;
    if(isInternalObject(current)) {
      internal = current;
      internal.deserialize(value, changed);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalObjectWithData(this, value);
      update = true;
    }
    return { update, internal };
  }

  _deserializeArrayValue(value, current, changed) {
    let internal;
    let update;
    if(isInternalArray(current)) {
      console.log('isInternalArray', value, current, changed);
      // internal = current;
      // internal.deserialize(value, changed);
      // update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalArrayWithData(this, value);
      update = true;
    }
    return { update, internal };
  }

  _deserializeInternalObjectValue(value, current) {
    this._detachInternal(current);
    this._attachInternal(value);
    return { update: true, internal: value };
  }

  _deserializeValue(value, current, changed) {
    value = toInternal(value);

    if(current === value) {
      return {
        update: false,
        internal: value
      };
    }

    if(current === empty) {
      current = undefined;
    }

    if(isInternal(value)) {
      if(value.isDetached) {
        if(isInternalObject(value)) {
          return this._deserializeInternalObjectValue(value, current);
        } else if(isInternalArray(value)) {
          console.log('internal detached array', value);
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
      return this._deserializeObjectValue(value, current, changed);
    } else if(type === 'array') {
      return this._deserializeArrayValue(value, current, changed);
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

  get serialized() {
    return this.serialize();
  }

}

export const typed = (Class, type) => {
  Class.prototype.type = type;
  return Class;
};
