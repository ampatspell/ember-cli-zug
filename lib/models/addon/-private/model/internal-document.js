import Internal from './internal';
import withPropertyChanges from '../util/with-property-changes';

export default class InternalDocument extends Internal {

  constructor(context, reference, data) {
    super(context);
    this._reference = reference;
    this._data = data;
    reference.assign(this);
  }

  withPropertyChanges(notify, cb) {
    return withPropertyChanges(this, notify, cb);
  }

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

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

}
