import InternalContext from './internal-context';
import Auth from '../auth/internal-auth';
import configureFirebase from './firebase-initializer';
import { assert } from '@ember/debug';

const validate = opts => {
  assert(`options must be object`, typeof opts === 'object');
  let { firebase, modelNameForDocument, storeNameForIdentifier, firestorePersistenceEnabled } = opts;
  assert(`options.firebase must be object`, !firebase || typeof firebase === 'object');
  assert(`options.modelNameForDocument must be function`, typeof modelNameForDocument === 'function');
  assert(`options.storeNameForIdentifier must be function`, !storeNameForIdentifier || typeof storeNameForIdentifier === 'function');
  if(typeof firestorePersistenceEnabled === 'undefined') {
    opts.firestorePersistenceEnabled = true;
  }
  return opts;
}

export default class InternalRootContext extends InternalContext {

  constructor(stores, identifier, opts) {
    super(stores, identifier);
    this.root = this;
    this.opts = validate(opts);
    this.auth = new Auth(this);
    this._configure(identifier, opts);
  }

  get absoluteIdentifier() {
    return this.identifier;
  }

  _configure(identifier, opts) {
    this.ready = configureFirebase(identifier, opts.firestorePersistenceEnabled, opts.firebase).then(firebase => {
      this.firebase = firebase;
      this.firestore = firebase.firestore();
    });
  }

  willDestroy() {
    this.stores.rootContextWillDestroy(this);
    this.auth.destroy();
    this.firebase && this.firebase.delete();
    super.willDestroy();
  }

}
