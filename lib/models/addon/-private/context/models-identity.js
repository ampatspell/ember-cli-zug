import { A } from '@ember/array';
import Destroyable from '../model/destroyable';

export default class ModelsIdentity extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.storage = {
      all: A(),
      ref: Object.create(null)
    };
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
