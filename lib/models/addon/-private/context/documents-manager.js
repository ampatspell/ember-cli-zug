import Destroyable from '../model/destroyable';
import LocalReference from '../model/reference/local-reference';
import InternalDocument from '../model/internal-document';

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

  _createInternalDocument(reference, data) {
    return new InternalDocument(this.context, reference, data);
  }

  createNewInternalDocument(opts, json) {
    let reference = this._createLocalReference(opts);
    let data = this._createInternalData(json);
    let internal = this._createInternalDocument(reference, data);
    // TODO: register in identity
    return internal;
  }

}
