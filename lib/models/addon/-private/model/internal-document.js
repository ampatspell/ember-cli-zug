import Internal from './internal';
import withPropertyChanges from '../util/with-property-changes';

export default class InternalDocument extends Internal {

  constructor(context, reference, data) {
    super(context);
    this._reference = reference;
    this._data = data;
    reference.assign(this);
  }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

  withPropertyChanges(notify, cb) {
    return withPropertyChanges(this, notify, cb);
  }

  get documents() {
    return this.context._internal.documents;
  }

  //

  get data() {
    return this._data;
  }

  get id() {
    return this._reference.id;
  }

  get collection() {
    return this._reference.collection;
  }

  get path() {
    return this._reference.path;
  }

  set id(value) {
    this._reference.id = value;
  }

  set collection(value) {
    this._reference.collection = value;
  }

  set path(value) {
    this._reference.path = value;
  }

  //

  didCreate(ref) {
    let current = this._reference;
    let reference = this.documents.createPersistedReference(ref);
    reference.assign(this);
    this._reference = reference;
    current.destroy();
  }

  save() {
    return this._reference.save();
  }

  //

  willDestroy() {
    this._reference.destroy();
    super.willDestroy();
  }

}
