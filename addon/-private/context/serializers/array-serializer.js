import Serializer from './serializer';
import InternalArray from '../../model/data/internal-array';
import { nothing } from '../../model/data/util';
import { A } from '@ember/array';

export default class ArraySerializer extends Serializer {

  create(json, format) {
    let internal = new InternalArray(this.context);
    this.update(internal, json, format, false);
    return internal;
  }

  _update(internal, json, format, changed) {
    let content = internal.content;

    let add = [];
    let remove = A(content.copy());

    json.forEach((value, idx) => {
      let internal = content.find(internal => {
        let serializer = this.manager.serializerForObject(internal);
        return serializer.isEqual(internal, value, format);
      });
      if(internal) {
        remove.removeObject(internal);
      } else {
        internal = this.manager.update(nothing, value, format, true).internal;
        add.push({ internal, idx });
      }
    });

    internal.removeInternal(remove, changed);
    internal.insertInternal(add, changed);
  }

  update(internal, json, format, notify) {
    internal.withPropertyChanges(notify, changed => this._update(internal, json, format, changed));
    return {
      replace: false,
      internal
    };
  }

  serialize(internal, format) {
    let manager = this.manager;
    return internal.content.map(item => manager.serialize(item, format));
  }

  isEqual() {
    return false;
  }

}
