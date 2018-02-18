const noop = () => {};

export default class Reference {

  constructor() {
    this._document = null;
  }

  get document() {
    return this._document;
  }

  get context() {
    return this._document.context;
  }

  get documents() {
    return this.context._internal.documents;
  }

  withDocumentPropertyChanges(notify, cb) {
    let document = this._document;
    if(!document) {
      return cb(noop);
    }
    return document.withPropertyChanges(notify, cb);
  }

  assign(document) {
    this._document = document;
  }

  destroy() {
    this._document = null;
  }

}
