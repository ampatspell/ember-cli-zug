import { defer } from 'rsvp';
import FireError from './util/error';
import { A } from '@ember/array';

export default class QueryLoader {

  constructor(context, opts) {
    this.context = context;
    this.opts = opts;
    this._deferred = null;
    this._cancel = null;
    this._resolved = false;
    this.content = A();
  }

  _resolve() {
    if(this._resolved || !this._deferred) {
      return;
    }
    this._resolved = true;
    this._deferred.resolve();
  }

  _reject(err) {
    if(this._resolved || !this._deferred) {
      return;
    }
    this._deferred.reject(err);
  }

  _onSnapshot(snapshot) {
    let changes = snapshot.docChanges;
    let content = this.content;
    let added = [];

    changes.forEach(change => {
      let { type, doc } = change;

      if(type === 'added') {
        let internal = this.context._internal.documents.createInternalDocument(doc);
        let document = internal.model(true);
        added.push(document);
        console.log(this.opts.id, 'added', document+'');
      } else if(type === 'modified') {
        let document = content.objectAt(change.oldIndex);
        document._internal.snapshot = doc;
        console.log(this.opts.id, 'modified', document+'');
      } else {
        console.log(this.opts.id, 'change', type, 'todo');
      }
    });

    content.addObjects(added);

    this._resolve();
  }

  _buildQuery() {
    let firestore = this.context._internal.firestore;
    let query = this.opts.query;
    return query(firestore);
  }

  _load() {
    let query = this._buildQuery();
    let cancel = query.onSnapshot(snapshot => this._onSnapshot(snapshot));
    let deferred = defer();

    this._cancel = cancel;
    this._deferred = deferred;

    return deferred;
  }

  load() {
    let deferred = this._deferred;
    if(!deferred) {
      deferred = this._load();
      this._deferred = deferred;
    }
    return deferred.promise;
  }

  destroy() {
    this._reject(new FireError({ error: 'query', reason: 'cancelled' }));
    this._cancel && this._cancel();
    console.log('destroy', this);
  }

}
