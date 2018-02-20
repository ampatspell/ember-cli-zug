import InternalContext from './internal-context';
import configureFirebase from './firebase-initializer';

export default class InternalRootContext extends InternalContext {

  constructor(stores, identifier, opts) {
    super(stores, identifier);
    this._configure(identifier, opts);
  }

  get absoluteIdentifier() {
    return this.identifier;
  }

  _configure(identifier, opts) {
    this.ready = configureFirebase(identifier, opts).then(firebase => {
      this.firebase = firebase;
      this.firestore = firebase.firestore();
    });
  }

  willDestroy() {
    this.stores.rootContextWillDestroy(this);
    this.firebase && this.firebase.delete();
    super.willDestroy();
  }

}
