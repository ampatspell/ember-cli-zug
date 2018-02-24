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
    let documents = this.context.documentsManager;
    let models = this.context.modelsManager;
    let delegate = this._delegate;
    return {
      onLoading: () => delegate.onLoading(),
      onLoaded: () => delegate.onLoaded(),
      createModel(snapshot) {
        let ref = snapshot.ref;
        let exists = snapshot.exists;
        let data = snapshot.data();
        let document = documents.loadedInternalDocument(ref, exists, data);
        let model = models.internalModelForDocument(document);
        return model.model(true);
      },
      updateModel(model) {
        return model;
      },
      destroyModel() {}
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
