import Internal from './internal';

export default class InternalDocument extends Internal {

  constructor(context, documents, snapshot) {
    super(context);
    this.documents = documents;
    this._snapshot = snapshot;
    this.data = context._internal.data.createObject(snapshot.data());
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
    this.context._internal.data.updateObject(this.data, this._snapshot.data());
    this.notifyPropertyChanges([ 'id', 'path', 'parent' ]);
  }

  get id() {
    return this._snapshot.id;
  }

  get path() {
    return this._snapshot.ref.path;
  }

  save() {
    let snapshot = this._snapshot;
    let data = this.data;
    let ref = snapshot.ref;
    let version = data.get('version') || 0;
    version++;
    return ref.set({ version }, { merge: true });
  }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

}
