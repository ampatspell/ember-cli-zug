import InternalObject from '../../model/data/internal-object';
import Serializer from './serializer';

const rm = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class ObjectSerializer extends Serializer {

  create(json, format) {
    let internal = new InternalObject(this.context);
    this.update(internal, json, format, false);
    return internal;
  }

  update(internal, json, format, notify) {
    return internal.withPropertyChanges(notify, changed => {

      let setter = (key, value) => internal.setInternalValueForKey(key, value, changed);
      let keys = Object.keys(internal.content);

      for(let key in json) {
        rm(keys, key);
        setter(key, json[key]);
      }

      keys.forEach(key => setter(key, undefined));

      return {
        replace: false,
        internal
      };
    });
  }

  serialize(internal, format) {
    let json = {};
    let content = internal.content;
    let manager = this.manager;
    for(let key in content) {
      let value = manager.serialize(content[key], format);
      if(value !== undefined) {
        json[key] = value;
      }
    }
    return json;
  }

}
