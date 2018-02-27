import QueryArrayObserver from './observer/query-array-observer';
import DocumentArrayObserver from './observer/document-array-observer';
import { isDocumentReference, isQueryOrCollectionReference } from '../util/firestore-types';

export default class QueryArrayLoader {

  constructor(context, opts, delegate) {
    this.context = context;
    this.opts = opts;
    this._observer = null;
    this._delegate = delegate;
  }

  get query() {
    let firestore = this.context.firestore;
    let query = this.opts.query;
    return query(firestore);
  }

  get _observerDelegate() {
    let context = this.context;
    let delegate = this._delegate;
    return {
      onLoading: () => delegate.onLoading(),
      onLoaded: () => delegate.onLoaded(),
      createModel: snapshot => context.loadedInternalPersistedModelForSnapshot(snapshot).model(true),
      updateModel: model => model,
      destroyModel: () => {}
    };
  }

  createObserver() {
    let query = this.query;
    let delegate = this._observerDelegate;
    if(isQueryOrCollectionReference(query)) {
      return new QueryArrayObserver(query, delegate);
    } else if(isDocumentReference(query)) {
      return new DocumentArrayObserver(query, delegate);
    }
  }

  get observer() {
    let observer = this._observer;
    if(!observer) {
      observer = this.createObserver();
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
