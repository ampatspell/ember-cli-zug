import Reference from './reference';

export default class PersistedReference extends Reference {

  constructor(ref) {
    super();
    this._ref = ref;
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
    // resolve with 1st onSnapshot
  }

  //

  willDestroy() {
    this._ref = null;
    super.willDestroy();
  }

}
