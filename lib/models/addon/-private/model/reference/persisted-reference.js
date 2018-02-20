import Reference from './reference';
import DocumentReferenceObserver from '../document-reference-observer';
import FireError from '../../util/error';
import { reject } from 'rsvp';

export default class PersistedReference extends Reference {

  constructor(ref) {
    super();
    this._ref = ref;
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

  get immutablePath() {
    return this.path;
  }

  //

  _didLoad({ exists, data }) {
    this.document.didLoad(exists, data);
  }

  _didSave() {
    this.document.didSave();
  }

  _saveDidFail(err) {
    console.log('_saveDidFail', this, err);
  }

  save() {
    let data = this.document.data.serialize();
    let ref = this._ref;
    let transaction = this.transaction;
    return transaction.refSet(ref, data).then(() => this._didSave(), err => this._saveDidFail(err));
  }

  // { optional }
  load(opts={}) {
    return this._observer.promise.then(snapshot => {
      if(!snapshot.exists && !opts.optional) {
        return reject(new FireError({ error: 'document', reason: 'missing' }));
      }
    });
  }

  //

  willDestroy() {
    // console.log('willDestroy', this);
    this._observer.destroy();
    this._ref = null;
    super.willDestroy();
  }

}
