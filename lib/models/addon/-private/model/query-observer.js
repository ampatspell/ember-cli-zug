import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import { defer } from 'rsvp';
import FireError from '../util/error';

export default class QueryObserver {

  constructor(query) {
    this._query = query;
    this._deferred = null;
    this.content = A();
    this._start();
  }

  get promise() {
    return this._deferred.promise;
  }

  // TODO: store Document here
  // document should have at least ref and data
  _onChange(change) {
    let { type, oldIndex, newIndex, doc } = change;
    let ref = doc.ref;
    let data = assign({ ref }, doc.data());
    console.log('_onChange', type, ref.id, oldIndex, newIndex, data);
    let content = this.content;
    if(type === 'added') {
      content.insertAt(newIndex, data);
    } else if(type === 'modified') {
      content.removeAt(oldIndex);
      content.insertAt(newIndex, data);
    } else if(type === 'removed') {
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
    this._deferred.reject(new FireError({ error: 'query-observer', reason: 'cancelled' }));

    this._cancel = null;
    this._query = null;
    this._deferred = null;
  }

  destroy() {
    this._stop();
  }

}
