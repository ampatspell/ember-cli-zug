import Serializer from './serializer';
import InternalArray from '../../model/data/internal-array';
import { nothing } from '../../model/data/util';

export default class ArraySerializer extends Serializer {

  create(json, format) {
    let internal = new InternalArray(this.context);
    this.update(internal, json, format, false);
    return internal;
  }

  _update(internal, json, format, changed) {
    let content = internal.content;

    let equalPairs = [];
    content.forEach(internal => {
      let serializer = this.manager.serializerForObject(internal);
      json.forEach(json => {
        if(serializer.isEqual(internal, json, format)) {
          equalPairs.push({ internal, json });
        }
      });
    });

    console.log('equalPairs', equalPairs);

    internal.removeInternal(content, changed);
    let created = json.map(value => this.manager.update(nothing, value, format, true).internal);
    internal.addInternal(created, changed);
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
