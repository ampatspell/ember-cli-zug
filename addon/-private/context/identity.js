import Destroyable from '../model/destroyable';
import ModelsIdentity from './models-identity';
import DocumentsIdentity from './documents-identity';
import StorageIdentity from './storage-identity';

export default class Identity extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.models = new ModelsIdentity(context);
    this.documents = new DocumentsIdentity(context);
    this.storage = new StorageIdentity(context);
  }

  willDestroy() {
    this.models.destroy();
    this.documents.destroy();
    this.storage.destroy();
    super.willDestroy();
  }

}
