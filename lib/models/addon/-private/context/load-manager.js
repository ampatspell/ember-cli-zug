import { A } from '@ember/array';
import { assert } from '@ember/debug';
import Destroyable from '../model/destroyable';
import pathFromOptions from '../util/path-from-options';
import Operation from '../model/operation';
import { reject } from 'rsvp';
import FireError from '../util/error';
import { isDocumentSnapshot, isQuerySnapshot } from '../util/firestore-types';
import queryFirst from '../util/query-first';

export default class LoadManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
  }

  get firestore() {
    return this.context.firestore;
  }

  get operations() {
    return this.context.operations;
  }

  //

  _schedule(operation) {
    this.operations.register(operation);
    operation.promise.catch(() => {}).finally(() => {
      this.operations.remove(operation);
    });
    operation.invoke();
    return operation.promise;
  }

  //

  _refFromPath(path) {
    if(!path) {
      return;
    }

    let components = path.split('/');

    if(components.length % 2) {
      return this.firestore.collection(path);
    } else {
      return this.firestore.doc(path);
    }
  }

  _buildQuery(query, ref) {
    if(!query) {
      return ref;
    }
    return query(ref || this.firestore);
  }

  //

  _deserializeDocumentSnapshot(snapshot) {
    return this.context.loadedInternalPersistedModelForSnapshot(snapshot);
  }

  _deserializeQuerySnapshot(snapshot) {
    return snapshot.docs.map(doc => this._deserializeDocumentSnapshot(doc));
  }

  //

  _queryDidLoad(snapshot) {
    let result;
    let type;
    if(isDocumentSnapshot(snapshot)) {
      type = 'single';
      result = this._deserializeDocumentSnapshot(snapshot);
    } else if(isQuerySnapshot(snapshot)) {
      type = 'array';
      result = this._deserializeQuerySnapshot(snapshot);
    }
    return { result, type };
  }

  _invokeQuery(query, info) {
    let operation = new Operation(() => query.get().then(snapshot => this._queryDidLoad(snapshot)), info);
    return this._schedule(operation);
  }

  //

  _load(opts={}, postprocess) {
    let path = pathFromOptions(opts, false, true);
    let ref = this._refFromPath(path);
    let query = this._buildQuery(opts.query, ref);
    assert(`options must build query`, !!query);
    if(postprocess) {
      query = postprocess(query);
    }
    return this._invokeQuery(query, { name: 'load', opts });
  }

  load(opts) {
    return this._load(opts).then(({ result, type }) => {
      if(type === 'single') {
        return result.model(true);
      } else if(type === 'array') {
        return A(result.map(internal => internal.model(true)));
      }
    });
  }

  first(opts={}) {
    let { optional } = opts;
    return this._load(opts, queryFirst).then(({ result, type }) => {
      let internal;

      if(type === 'single') {
        internal = result;
      } else if(type === 'array') {
        internal = result[0];
      }

      if((!internal || !internal.doc.state.isExisting) && !optional) {
        return reject(new FireError({ error: 'document', reason: 'missing' }));
      }

      if(!internal) {
        return;
      }

      return internal.model(true);
    });
  }

}
