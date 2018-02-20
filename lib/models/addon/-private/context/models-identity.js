import { A } from '@ember/array';
import Destroyable from '../model/destroyable';

export default class ModelsIdentity extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.storage = {
      all:        A(),
      persistent: Object.create(null)
    };
  }

  storeInternalModel(internal) {
    let storage = this.storage;
    storage.all.addObject(internal);
    let path = internal.persistentPath;
    if(path) {
      storage.persistent[path] = internal;
    }
  }

  removeInternalModel(internal) {
    let storage = this.storage;
    this.storage.all.removeObject(internal);
    let path = internal.persistentPath;
    if(path) {
      delete storage.persistent[path];
    }
  }

  existingInternalModel(path) {
    return this.storage.persistent[path];
  }

  willDestroy() {
    this.storage.all.map(internal => internal.destroy());
    super.willDestroy();
  }

}
