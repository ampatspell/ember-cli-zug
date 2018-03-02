import InternalData, { typed } from './internal-data';
import { toModel, nothing } from './util';

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

  contentHasKey(key) {
    return Object.prototype.hasOwnProperty.call(this.content, key);
  }

  getModelForKey(key) {
    if(this.contentHasKey(key)) {
      return toModel(this.getInternalValueForKey(key));
    } else {
      return undefined;
    }
  }

  setModelForKey(key, value) {
    return this.withPropertyChanges(true, changed => toModel(this.setInternalValueForKey(key, value, changed)));
  }

  getInternalValueForKey(key) {
    return this.content[key];
  }

  setInternalValueForKey(key, value, changed) {
    let content = this.content;

    let current = nothing;
    if(this.contentHasKey(key)) {
      current = content[key];
    }

    let { replace, internal } = this.manager.update(current, value, 'model', true);

    if(replace) {
      this.detachInternal(current);
      if(internal === undefined) {
        delete content[key];
      } else {
        this.attachInternal(internal);
        content[key] = internal;
      }
      changed(key);
    }

    return internal;
  }

}, 'object');
