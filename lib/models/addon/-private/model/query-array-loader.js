import QueryArrayObserver from './query-array-observer';

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

  get observer() {
    let observer = this._observer;
    if(!observer) {
      observer = new QueryArrayObserver(this.query, this._observerDelegate);
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
