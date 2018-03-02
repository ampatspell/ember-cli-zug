import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import Destroyable from '../model/destroyable';
import ObjectSerializer from './serializers/object-serializer';
import PrimitiveSerializer from './serializers/primitive-serializer';
import { isInternal, nothing } from '../model/data/util';

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
    if(object === nothing) {
      return;
    }
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
  update(current, value, format, notify) {
    // updates internal from json
    assertFormat(format);

    let currentSerializer = this.serializerForObject(current);
    let valueSerializer = this.serializerForObject(value);

    if(currentSerializer === valueSerializer) {
      return currentSerializer.update(current, value, format, notify);
    } else {
      let internal = valueSerializer.create(value, format);
      return { replace: true, internal };
    }
  }

  // createInternalArray(parent, json) {
  //   let internal = new InternalArray(this.context, parent);
  //   this._deserializeInternal(internal, json, false);
  //   return internal;
  // }

  createInternal(json={}) {
    let serializer = this.serializerForObject(json);
    return serializer.create(json, 'model');
  }

}
