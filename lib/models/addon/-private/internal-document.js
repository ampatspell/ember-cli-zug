import Internal from './internal';
import QueryLoader from './query-loader';

export default class InternalDocument extends Internal {

  constructor(context, documents, snapshot) {
    super(context);
    this.documents = documents;
    this._snapshot = snapshot;
  }

  notifyPropertyChanges(keys) {
    let model = this.model(false);
    if(!model) {
      return;
    }
    model.beginPropertyChanges();
    keys.map(key => model.notifyPropertyChange(key));
    model.endPropertyChanges();
}

  set snapshot(snapshot) {
    this._snapshot = snapshot;
    this.notifyPropertyChanges([ 'id', 'path', 'parent', 'data' ]);
  }

  get id() {
    return this._snapshot.id;
  }

  get path() {
    return this._snapshot.ref.path;
  }

  get data() {
    return this._snapshot.data();
  }

  save() {
    let snapshot = this._snapshot;
    let data = this.data;
    let ref = snapshot.ref;
    let version = data.version || 0;
    version++;
    return ref.set({ version }, { merge: true });
  }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

  willDestroy() {
    super.willDestroy();
  }

}
