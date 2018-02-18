import Reference from './reference';
import DocumentReferenceObserver from '../document-reference-observer';
import FireError from '../../util/error';
import { reject } from 'rsvp';

export default class PersistedReference extends Reference {

  constructor(ref) {
    super();
    this._ref = ref;
    this._state = {
      exists: undefined
    };
    this._observer = new DocumentReferenceObserver(ref, {
      update: props => this._didLoad(props)
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

  get exists() {
    return this._state.exists;
  }

  //

  _didLoad({ exists, data }) {
    this._state.exists = exists;
    this.document.didLoad(data);
  }

  _didSave() {
    console.log('_didSave', this);
    this._state.exists = true;
    this.document.didSave();
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
    return this._observer.promise.then(() => {
      if(!this.exists) {
        return reject(new FireError({ error: 'document', reason: 'missing' }));
      }
    });
  }

  //

  willDestroy() {
    console.log('willDestroy', this);
    this._observer.destroy();
    this._ref = null;
    super.willDestroy();
  }

}
