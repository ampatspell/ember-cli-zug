import Serializer from './serializer';

export default class PrimitiveSerializer extends Serializer {

  update(internal, value, format, notify) {
    return { replace: true, internal: value };
  }

  create(value, format) {
    return value;
  }

  serialize(value) {
    return value;
  }

}
