import Destroyable from '../destroyable';

const noop = () => {};

export default class Reference extends Destroyable {

  constructor() {
    super();
    this._document = null;
  }

  get document() {
    return this._document;
  }

  get context() {
    return this._document.context;
  }

  get documents() {
    return this.context.documentsManager;
  }

  get transaction() {
    return this.context.transactionManager;
  }

  withDocumentPropertyChanges(notify, cb) {
    let document = this._document;
    if(!document) {
      return cb(noop);
    }
    return document.withPropertyChanges(notify, cb);
  }

  assignDocument(document) {
    this._document = document;
  }

  withDocument(cb) {
    let document = this.document;
    if(!document) {
      return;
    }
    return cb(document);
  }

  willDestroy() {
    this._document = null;
    super.willDestroy();
  }

}
