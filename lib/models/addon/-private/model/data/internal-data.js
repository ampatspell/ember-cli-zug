import Internal from '../internal';
import { isInternal } from './util';

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

  //

  didDetach() {
  }

  didAttach() {
  }

  detach() {
    if(!this.parent) {
      return;
    }
    this.parent = null;
    this.didDetach();
  }

  attach(parent) {
    this.parent = parent;
    this.didAttach();
  }

  get isDetached() {
    return !this.parent;
  }

  detachInternal(value) {
    if(!isInternal(value)) {
      return;
    }
    value.detach();
  }

  attachInternal(value) {
    if(!isInternal(value)) {
      return;
    }
    value.attach(this);
  }

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
