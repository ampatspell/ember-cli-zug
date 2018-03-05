import Serializer from './serializer';
import InternalArray from '../../model/data/internal-array';
import { nothing } from '../../model/data/util';
import { copy } from '@ember/object/internals';
import { A } from '@ember/array';

export default class ArraySerializer extends Serializer {

  create(json, format) {
    let internal = new InternalArray(this.context);
    this.update(internal, json, format, false);
    return internal;
  }

  _update(internal, json, format, changed) {
    let content = internal.content;

    let removed = A(copy(content));
    let added = A(copy(json));

    content.forEach(internal => {
      let serializer = this.manager.serializerForObject(internal);
      let value = json.find(json => serializer.isEqual(internal, json, format));
      let equal = value !== undefined;
      if(equal) {
        added.removeObject(value);
        removed.removeObject(internal);
      }
    });

    // TODO: ordering

    let created = added.map(value => this.manager.update(nothing, value, format, true).internal);

    internal.removeInternal(removed, changed);
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
