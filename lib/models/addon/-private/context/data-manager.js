import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import Destroyable from '../model/destroyable';
import InternalObject from '../model/data/internal-object';
import InternalArray from '../model/data/internal-array';
import ObjectSerializer from './serializers/object-serializer';
import PrimitiveSerializer from './serializers/primitive-serializer';
import { isInternal } from '../model/data/util';

const formats = [ 'model', 'preview', 'storage' ];
const assertFormat = format => {
  assert(`format must be one of [ ${formats.join(', ')}] not ${format}`, formats.includes(format));
};

export default class DataManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.serializers = {
      'object':    new ObjectSerializer(context),
      'primitive': new PrimitiveSerializer(context)
    };
  }

  serializerForObject(object) {
    let serializer;
    if(isInternal(object)) {
      serializer = object.type;
    } else {
      let type = typeOf(object);
      if(type === 'string' || type === 'undefined') {
        serializer = 'primitive';
      } else if(type === 'object') {
        serializer = 'object';
      }
    }
    assert(`no serializer for ${object}`, !!serializer);
    let instance = this.serializers[serializer];
    assert(`serializer for name ${serializer} not declared`, !!instance);
    return instance;
  }

  // toJSON
  serialize(object, format) {
    assertFormat(format);
    let serializer = this.serializerForObject(object);
    return serializer.serialize(object, format);
  }

  // toInternal
  deserialize(json, format) {
    // returns internal or primitive
    assertFormat(format);
    let serializer = this.serializerForObject(json);
    return serializer.deserialize(json, format);
  }

  update(internal, json, format, notify) {
    // updates internal from json
    assertFormat(format);
    let current = this.serializerForObject(internal);
    let next = this.serializerForObject(json);
    let replace;
    if(current === next) {
      return current.update(internal, json, format, notify);
    } else {
      internal = next.deserialize(json, format);
      return { replace: true, internal };
    }
  }

  // _deserializeInternal(internal, json, notify) {
  //   internal.withPropertyChanges(notify, changed => internal.deserialize(json, changed));
  //   return internal;
  // }

  // createInternalArray(parent, json) {
  //   let internal = new InternalArray(this.context, parent);
  //   this._deserializeInternal(internal, json, false);
  //   return internal;
  // }

  // createInternalObject(parent, json) {
  //   let internal = new InternalObject(this.context, parent);
  //   this.update(internal, json, 'model', false);
  //   // this._deserializeInternal(internal, json, false);
  //   return internal;
  // }

  // updateInternalObject(internal, json) {
  //   this._deserializeInternal(internal, json, true);
  //   return internal;
  // }

  createInternal(json={}) {
    let serializer = this.serializerForObject(json);
    return serializer.deserialize(json, 'model');
  }

}
