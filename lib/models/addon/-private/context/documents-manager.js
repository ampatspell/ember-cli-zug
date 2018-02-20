import Destroyable from '../model/destroyable';
import LocalReference from '../model/reference/local-reference';
import PersistedReference from '../model/reference/persisted-reference';
import InternalDocument from '../model/internal-document';
import pathFromOptions from '../util/path-from-options';

export default class DocumentsManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
  }

  _createInternalData(json) {
    return this.context.dataManager.createInternalObject(null, json);
  }

  _createLocalReference({ id, collection, path }) {
    return new LocalReference(id, collection, path);
  }

  _createPersistedReference({ id, collection, path }) {
    let ref = this.context.firestore.doc(pathFromOptions({ id, collection, path }));
    return new PersistedReference(ref);
  }

  _createInternalDocument(reference, data) {
    return new InternalDocument(this.context, reference, data);
  }

  // { id, collection, path, data }
  createNewInternalDocument(opts) {
    let reference = this._createLocalReference(opts);
    let data = this._createInternalData(opts.data);
    let internal = this._createInternalDocument(reference, data);
    // TODO: register in identity
    return internal;
  }

  // { id, collection, path, data }
  createExistingInternalDocument(opts) {
    let reference = this._createPersistedReference(opts);
    let data = this._createInternalData(opts.data);
    let internal = this._createInternalDocument(reference, data);
    // TODO: register in identity
    return internal;
  }

}
