import Internal from './internal';

export default class InternalDocument extends Internal {

  constructor(context, data) {
    super(context);
    this._reference = null;
    this._data = data;
  }

  get data() {
    return this._data;
  }

  get id() {
    return this._reference.id;
  }

  get path() {
    return this._reference.path;
  }

  get collection() {
    return this._reference.collection;
  }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

}
