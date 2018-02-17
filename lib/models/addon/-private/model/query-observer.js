import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { defer } from 'rsvp';
import FireError from '../util/error';

// query: CollectionReference or Query
// delegate: {
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class QueryObserver {

  constructor(query, delegate) {
    this._query = query;
    this._delegate = delegate;
    this._deferred = null;
    this._content = A();
    this._start();
  }

  get promise() {
    return this._deferred && this._deferred.promise;
  }

  get content() {
    return this._content;
  }

  _createModel(doc) {
    return this._delegate.createModel(doc);
  }

  _updateModel(model, doc) {
    return this._delegate.updateModel(model, doc);
  }

  _destroyModel(model) {
    return this._delegate.destroyModel(model);
  }

  // TODO: store Document here
  // document should have at least ref and data
  _onChange(change) {
    let { type, oldIndex, newIndex, doc } = change;
    let ref = doc.ref;
    console.log('QueryObserver _onChange', type, ref.id, oldIndex, newIndex);
    let content = this._content;
    if(type === 'added') {
      let model = this._createModel(doc);
      content.insertAt(newIndex, model);
    } else if(type === 'modified') {
      let current = content.objectAt(oldIndex);
      let model = this._updateModel(current, doc);
      if(oldIndex !== newIndex) {
        content.removeAt(oldIndex);
        content.insertAt(newIndex, model);
      } else if (current !== model) {
        content.replace(newIndex, 1, [ model ]);
      }
    } else if(type === 'removed') {
      let model = content.objectAt(oldIndex);
      this._destroyModel(model);
      content.removeAt(oldIndex);
    }
  }

  _onSnapshot(snapshot) {
    let changes = snapshot.docChanges;
    changes.map(change => this._onChange(change));
    this._deferred.resolve();
  }

  _start() {
    console.log('_start', this);
    this._deferred = defer();
    this._cancel = this._query.onSnapshot(snapshot => run(() => this._onSnapshot(snapshot)));
  }

  _stop() {
    console.log('_stop', this);
    this._cancel();
    this._content.map(model => this._destroyModel(model));
    this._deferred.reject(new FireError({ error: 'query-observer', reason: 'cancelled' }));

    this._cancel = null;
    this._query = null;
    this._deferred = null;
    this._content = null
  }

  destroy() {
    this._stop();
  }

}
