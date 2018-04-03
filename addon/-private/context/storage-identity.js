import { A } from '@ember/array';
import Destroyable from '../model/destroyable';

const refIdentifier = ref => ref.toString();

export default class StorageIdentity extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.storage = {
      all: A(),
      ref: Object.create(null)
    };
  }

  storeReference(internal) {
    let identifier = refIdentifier(internal.ref);
    let storage = this.storage;
    storage.all.addObject(internal);
    storage.ref[identifier] = internal;
  }

  removeReference(internal) {
    let identifier = refIdentifier(internal.ref);
    let storage = this.storage;
    storage.all.removeObject(internal);
    delete storage.ref[identifier];
  }

  existingForRef(ref) {
    let identifier = refIdentifier(ref);
    return this.storage.ref[identifier];
  }

  willDestroy() {
    this.storage.all.map(internal => internal.destroy());
    super.willDestroy();
  }

}
