import { defer } from 'rsvp';
import FireError from '../util/error';
import { A } from '@ember/array';
import QueryObserver from './query-observer';

export default class QueryLoader {

  constructor(context, opts) {
    this.context = context;
    this.opts = opts;
    this._observer = null;
  }

  get query() {
    let firestore = this.context._internal.firestore;
    let query = this.opts.query;
    return query(firestore);
  }

  get observer() {
    let observer = this._observer;
    if(!observer) {
      let documents = this.context._internal.documents;
      observer = new QueryObserver(this.query, {
        createModel(snapshot) {
          let ref = snapshot.ref;
          let data = snapshot.data();
          return documents.createLoadedDocument(ref, data);
        },
        updateModel(model, snapshot) {
          // TODO: existing
          model._internal.didLoad(snapshot.data());
          return model;
        },
        destroyModel(model) {
        }
      });
      this._observer = observer;
    }
    return observer;
  }

  get content() {
    return this.observer.content;
  }

  load() {
    return this.observer.promise;
  }

  destroy() {
    this._observer && this._observer.destroy();
  }

}
