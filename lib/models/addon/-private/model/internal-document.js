import Internal from './internal';

export default class InternalDocument extends Internal {

  constructor(context, documents) {
    super(context);
    this.documents = documents;
    // this.data = context._internal.data.createObject(snapshot.data());
  }

  // set snapshot(snapshot) {
  //   this._snapshot = snapshot;
  //   this.context._internal.data.updateObject(this.data, this._snapshot.data());
  //   this.notifyPropertyChanges([ 'id', 'path', 'parent' ]);
  // }

  // get id() {
  //   return this._snapshot.id;
  // }

  // get path() {
  //   return this._snapshot.ref.path;
  // }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

}
