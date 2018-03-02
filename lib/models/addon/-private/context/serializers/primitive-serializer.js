import Serializer from './serializer';

export default class PrimitiveSerializer extends Serializer {

  update(current, value, format, notify) {
    if(current === value) {
      return {
        replace: false,
        internal: value
      };
    } else {
      return {
        replace: true,
        internal: value
      };
    }
  }

  create(value, format) {
    return value;
  }

  serialize(value) {
    return value;
  }

}
