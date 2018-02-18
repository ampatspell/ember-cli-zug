import Reference from './reference';
import DocumentReferenceObserver from '../document-reference-observer';

export default class PersistedReference extends Reference {

  constructor(ref) {
    super();
    this._ref = ref;
    this._observer = new DocumentReferenceObserver(ref, {
      update: (exists, data) => this._didLoad(exists, data)
    });
  }

  get id() {
    return this._ref.id;
  }

  get collection() {
    return this._ref.parent.path;
  }

  get path() {
    return this._ref.path;
  }

  //

  _didLoad(exists, data) {
    this.document.didLoad(exists, data);
  }

  _didSave() {
    console.log('_didSave', this);
  }

  _saveDidFail(err) {
    console.log('_saveDidFail', this, err);
  }

  save() {
    let data = this.document.data.serialize();
    let ref = this._ref;
    let transaction = this.transaction;
    return transaction.refSet(ref, data).then(() => this._didSave(ref), err => this._saveDidFail(err));
  }

  load() {
    return this._observer.promise;
  }

  //

  willDestroy() {
    console.log('willDestroy', this);
    this._observer.destroy();
    this._ref = null;
    super.willDestroy();
  }

}
