import { A } from '@ember/array';
import Internal from '../model/internal';

export default class ModelsIdentity extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.storage = {
      all: A(),
      ref: Object.create(null)
    };
  }

  createModel() {
    return this.context.factoryFor('models:identity').create({ content: this.storage.all });
  }

  storeInternalModel(internal) {
    let storage = this.storage;
    let path = internal.immutablePath;
    storage.all.addObject(internal);
    if(path) {
      storage.ref[path] = internal;
    }
  }

  removeInternalModel(internal) {
    let storage = this.storage;
    let path = internal.immutablePath;
    storage.all.removeObject(internal);
    if(path) {
      delete storage.ref[path];
    }
  }

  existingInternalModel(path) {
    return this.storage.ref[path];
  }

  willDestroy() {
    this.storage.all.map(internal => internal.destroy());
    super.willDestroy();
  }

}
