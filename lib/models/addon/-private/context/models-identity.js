import { A } from '@ember/array';
import Destroyable from '../model/destroyable';

export default class ModelsIdentity extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.storage = {
      all: A()
    };
  }

  storeInternalModel(internal) {
    let storage = this.storage;
    storage.all.addObject(internal);
  }

  removeInternalModel(internal) {
    let storage = this.storage;
    storage.all.removeObject(internal);
  }

  existingInternalModel() {
    throw new Error('not implemented');
    // return this.storage.persistent[path];
  }

  willDestroy() {
    this.storage.all.map(internal => internal.destroy());
    super.willDestroy();
  }

}
