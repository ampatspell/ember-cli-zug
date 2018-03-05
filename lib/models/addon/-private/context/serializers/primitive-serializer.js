import Serializer from './serializer';

export default class PrimitiveSerializer extends Serializer {

  update(current, value) {
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

  create(value) {
    return value;
  }

  serialize(value) {
    return value;
  }

  isEqual(current, value, format) {
    return current === value;
  }

}
