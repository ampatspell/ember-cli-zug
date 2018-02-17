const noop = () => {};

export default class Reference {

  constructor() {
    this._document = null;
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

  get id() {
  }

  get collection() {
  }

  get path() {
  }

  destroy() {
    this._document = null;
  }

}
