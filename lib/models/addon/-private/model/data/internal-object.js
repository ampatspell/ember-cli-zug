import InternalData, { typed } from './internal-data';
import { toModel } from './util';

// const rm = (array, element) => {
//   let idx = array.indexOf(element);
//   if(idx === -1) {
//     return;
//   }
//   array.splice(idx, 1);
// };

export default typed(class InternalObject extends InternalData {

  constructor(context, parent) {
    super(context, parent, Object.create(null));
  }

  createModel() {
    return this.factoryFor('models:data/object').create({ _internal: this });
  }

  //

  // getModelForKey(key) {
  //   let internal = this.content[key];
  //   return toModel(internal);
  // }

  // setModelForKey(key, value) {
  //   let internal = this.withPropertyChanges(true, changed => this.setValue(key, value, changed));
  //   return toModel(internal);
  // }

  contentHasKey(key) {
    return Object.prototype.hasOwnProperty.call(this.content, key);
  }

  getModelForKey(key) {
    if(this.contentHasKey(key)) {
      let value = this.content[key];
      return this.manager.serialize(value, 'model');
    } else {
      return undefined;
    }
  }

  setModelForKey(key, value) {
    return toModel(this.setValueForKey(key, value));
  }

  setValueForKey(key, value) {
    let current = this.content[key];
    if(this.contentHasKey(key)) {
      let { replace, internal } = this.manager.update(current, value, 'model', true);
      if(replace) {
        // unset current
        this.content[key] = internal;
      }
      return internal;
    } else {
      let internal = this.manager.deserialize(value, 'model');
      this.content[key] = internal;
      return internal;
    }
  }

  // //

  // setValue(key, value, changed) {
  //   let content = this.content;
  //   let current = content[key];

  //   let internal = this.toAttachable(value);

  //   if(current === value) {
  //     return current;
  //   }

  //   this.detachInternal(current);

  //   if(internal === undefined) {
  //     delete content[key];
  //   } else {
  //     content[key] = internal;
  //   }

  //   changed(key);

  //   return internal;
  // }

}, 'object');
