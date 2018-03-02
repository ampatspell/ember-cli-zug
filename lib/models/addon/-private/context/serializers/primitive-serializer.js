import Serializer from './serializer';

export default class PrimitiveSerializer extends Serializer {

  get updateReplacesContent() {
    return true;
  }

  update(internal, value, format, notify) {
    return value;
  }

  create(value, format) {
    return value;
  }

  serialize(value) {
    return value;
  }

}
