import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import Destroyable from '../model/destroyable';
import ObjectSerializer from './serializers/object-serializer';
import ArraySerializer from './serializers/array-serializer';
import InstanceSerializer from './serializers/instance-serializer';
import PrimitiveSerializer from './serializers/primitive-serializer';
import DocumentReferenceSerializer from './serializers/document-reference-serializer';
import GeoPointSerializer from './serializers/geopoint-serializer';
import { isInternal, toInternal, nothing } from '../model/data/util';
import { isDocumentReference, isGeoPoint } from '../util/firestore-types';

const formats = [ 'model', 'preview', 'storage' ];
const assertFormat = format => {
  assert(`format must be one of [ ${formats.join(', ')}] not ${format}`, formats.includes(format));
};

export default class DataManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.serializers = {
      'object':             new ObjectSerializer(context),
      'array':              new ArraySerializer(context),
      'instance':           new InstanceSerializer(context),
      'primitive':          new PrimitiveSerializer(context),
      'document-reference': new DocumentReferenceSerializer(context),
      'geopoint':           new GeoPointSerializer(context)
    };
  }

  serializerForObject(object) {
    if(object === nothing) {
      return;
    }
    let serializer;
    if(isInternal(object)) {
      serializer = object.type;
    } else if(isDocumentReference(object)) {
      serializer = 'document-reference';
    } else if(isGeoPoint(object)) {
      serializer = 'geopoint';
    } else {
      let type = typeOf(object);
      if(type === 'object') {
        serializer = 'object';
      } else if(type === 'array') {
        serializer = 'array';
      } else if(type === 'instance') {
        serializer = 'instance';
      } else {
        serializer = 'primitive';
      }
    }
    assert(`no serializer for ${object}`, !!serializer);
    let instance = this.serializers[serializer];
    assert(`serializer for name ${serializer} not declared`, !!instance);
    return instance;
  }

  serialize(object, format) {
    assertFormat(format);
    let serializer = this.serializerForObject(object);
    return serializer.serialize(object, format);
  }

  update(current, value, format, notify) {
    assertFormat(format);

    value = toInternal(value);

    if(isInternal(value)) {
      if(value.isDetached) {
        if(current === value) {
          return { replace: false, internal: current };
        } else {
          return { replace: true, internal: value };
        }
      } else {
        value = this.serialize(value, format);
      }
    }

    let currentSerializer = this.serializerForObject(current);
    let valueSerializer = this.serializerForObject(value);

    if(currentSerializer === valueSerializer) {
      return currentSerializer.update(current, value, format, notify);
    } else {
      let internal = valueSerializer.create(value, format);
      return {
        replace: true,
        internal
      };
    }
  }

  createInternal(json={}, format) {
    assertFormat(format);
    let serializer = this.serializerForObject(json);
    return serializer.create(json, format);
  }

  updateInternal(current, json, format) {
    assertFormat(format);
    let { internal } = this.update(current, json, format, true);
    assert(`internal after update must be the same instance`, internal === current);
    return internal;
  }

}
