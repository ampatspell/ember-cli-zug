import Serializer from './serializer';
import InternalArray from '../../model/data/internal-array';
import { nothing } from '../../model/data/util';

export default class ArraySerializer extends Serializer {

  create(json, format) {
    let internal = new InternalArray(this.context);
    this.update(internal, json, format, false);
    return internal;
  }

  update(internal, json, format, notify) {
    internal.withPropertyChanges(notify, changed => {
      let content = internal.content;
      internal.removeInternal(content, changed);
      let created = json.map(value => this.manager.update(nothing, value, format, true).internal);
      internal.addInternal(created, changed);
    });

    return {
      replace: false,
      internal
    };
  }

  serialize(internal, format) {
    let manager = this.manager;
    return internal.content.map(item => manager.serialize(item, format));
  }

}
