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
    internal.withPropertyChanges(notify, (changed, updated) => {
      let content = internal.content;

      if(internal.removeInternal(content)) {
        updated();
      }

      let created = json.map(value => this.manager.update(nothing, value, format, true).internal);

      if(internal.addInternal(created)) {
        updated();
      }
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
