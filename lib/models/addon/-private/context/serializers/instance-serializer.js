import Serializer from './serializer';

export default class InstanceSerializer extends Serializer {

  create(value, format) {
    if(typeof value.toJSON !== 'function') {
      return;
    }
    value = value.toJSON(format);
    return this.context.dataManager.createInternal(value, format);
  }

}
