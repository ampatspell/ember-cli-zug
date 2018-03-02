import Serializer from './serializer';

export default class PrimitiveSerializer extends Serializer {

  update(internal, json, format, notify) {

  }

  deserialize(value, format) {
    return value;
  }

  serialize(value) {
    return value;
  }

}
