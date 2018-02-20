import QueryObserver from './query-observer';

export default class QueryLoader {

  constructor(context, opts) {
    this.context = context;
    this.opts = opts;
    this._observer = null;
  }

  get query() {
    let firestore = this.context.firestore;
    let query = this.opts.query;
    return query(firestore);
  }

  get _observerDelegate() {
    let documents = this.context.documentsManager;
    return {
      createModel(snapshot) {
        let ref = snapshot.ref;
        let data = snapshot.data();
        let internal = documents.loadedInternalDocument(ref, data);
        return internal.model(true);
      },
      updateModel(model, snapshot) {
        model._internal.didLoad(snapshot.exists, snapshot.data());
        return model;
      },
      destroyModel() {}
    };
  }

  get observer() {
    let observer = this._observer;
    if(!observer) {
      observer = new QueryObserver(this.query, this._observerDelegate);
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
