import InternalContext from './internal-context';
import configureFirebase from './firebase-initializer';
import { assert } from '@ember/debug';

const validate = opts => {
  assert(`options must be object`, typeof opts === 'object');
  let { firebase, modelNameForDocument, storeNameForIdentifier, persistenceEnabled } = opts;
  assert(`options.firebase must be object`, !firebase || typeof firebase === 'object');
  assert(`options.modelNameForDocument must be function`, typeof modelNameForDocument === 'function');
  assert(`options.storeNameForIdentifier must be function`, !storeNameForIdentifier || typeof storeNameForIdentifier === 'function');
  if(typeof persistenceEnabled === 'undefined') {
    opts.persistenceEnabled = true;
  }
  return opts;
}

export default class InternalRootContext extends InternalContext {

  constructor(stores, identifier, opts) {
    super(stores, identifier);
    this.root = this;
    this.opts = validate(opts);
    this._configure(identifier, opts);
  }

  get absoluteIdentifier() {
    return this.identifier;
  }

  _configure(identifier, opts) {
    this.ready = configureFirebase(identifier, opts.persistenceEnabled, opts.firebase).then(firebase => {
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
