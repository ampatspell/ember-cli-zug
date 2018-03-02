import Internal from '../internal';
import { typeOf } from '@ember/utils';
import { toInternal, isInternal } from './util';
import { isDocumentReference, isGeoPoint } from '../../util/firestore-types';

export default class InternalData extends Internal {

  constructor(context, parent, content) {
    super();
    this.context = context;
    this.parent = parent || null;
    this.content = content;
  }

  get manager() {
    return this.context.dataManager;
  }

  factoryFor(name) {
    return this.context.factoryFor(name);
  }

  // didDetach() {
  // }

  // didAttach() {
  // }

  // detach() {
  //   if(!this.parent) {
  //     return;
  //   }
  //   this.parent = null;
  //   this.didDetach();
  // }

  // attach(parent) {
  //   this.parent = parent;
  //   this.didAttach();
  // }

  // get isDetached() {
  //   return !this.parent;
  // }

  //

  didUpdateChildInternalData(internal, notify) {
    this.withPropertyChanges(notify, changed => changed('serialized'));
  }

  didUpdate(notify) {
    let parent = this.parent;
    parent && parent.didUpdateChildInternalData(this, notify);
  }

  withPropertyChanges(notify, cb, skip) {
    let { result, updated } = super.withPropertyChanges(notify, changed => {
      let result = cb(changed);
      let updated = !!changed.properties.length;
      if(updated) {
        changed('serialized');
      }
      return { result, updated };
    }, skip);

    if(updated) {
      this.didUpdate(notify);
    }

    return result;
  }

  // detachInternal(value) {
  //   if(!isInternal(value)) {
  //     return;
  //   }
  //   value.detach();
  // }

  // attachInternal(value) {
  //   if(!isInternal(value)) {
  //     return;
  //   }
  //   value.attach(this);
  // }

  // toAttachable(value) {
  //   value = toInternal(value);

  //   if(isInternal(value)) {
  //     if(value.isDetached) {
  //       this.attachInternal(value);
  //       return value;
  //     }
  //     value = value.serialize();
  //   }

  //   if(isDocumentReference(value) || isGeoPoint(value)) {
  //     return value;
  //   }

  //   let type = typeOf(value);
  //   if(type === 'instance') {
  //     if(typeof value.toJSON === 'function') {
  //       value = value.toJSON();
  //     } else {
  //       value = undefined;
  //     }
  //     type = typeOf(value);
  //   }

  //   if(type === 'object') {
  //     return this.manager.createInternalObject(this, value);
  //   } else if(type === 'array') {
  //     return this.manager.createInternalArray(this, value);
  //   }

  //   return value;
  // }

  serialize(format='preview') {
    return this.manager.serialize(this, format);
  }

  get serialized() {
    return this.manager.serialize(this, 'preview');
  }

}

export const typed = (Class, type) => {
  Class.prototype.type = type;
  return Class;
};
