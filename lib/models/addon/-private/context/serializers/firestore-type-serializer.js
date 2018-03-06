import Serializer from './serializer';

export default class FirestoreTypeSerializer extends Serializer {

  update(current, value) {
    if(this.isEqual(current, value)) {
      return {
        replace: false,
        internal: current
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

  isEqual(current, value) {
    return current === value || current.isEqual(value);
  }

}
