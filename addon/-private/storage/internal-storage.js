import Internal from '../model/internal';
import firebase from 'firebase';
import { resolve } from 'rsvp';
import { join } from '@ember/runloop';
import { assert } from '@ember/debug';
import Reference from './internal-reference';

export default class InternalStorage extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this._storage = null;
  }

  createModel() {
    return this.context.factoryFor('zug:storage').create({ _internal: this });
  }

  //

  get storage() {
    let storage = this._storage;
    if(!storage) {
      let app = this.context.firebase;
      assert(`context should be ready before accessing storage`, !!app);
      storage = firebase.storage(app);
      this._storage = storage;
    }
    return storage;
  }

  withStorage(fn) {
    let storage = this.storage;
    return resolve(fn(storage));
  }

  //

  createReference(ref) {
    return new Reference(this.context, this, ref);
  }

  ref(path) {
    return this.createReference(this.storage.ref(path));
  }

  refFromURL(url) {
    return this.createReference(this.storage.refFromURL(url));
  }

}
