import Internal from './internal';
import Queue from './queue';
import DocumentState from './document-statate';

export default class InternalDocument extends Internal {

  constructor(context, reference, data) {
    super();
    this.context = context;
    this._data = data;
    this._queue = new Queue(context.operations);
    this._state = new DocumentState();
    this.assignReference(reference, false);
  }

  factoryFor(name) {
    return this.context.factoryFor(name);
  }

  createModel() {
    return this.factoryFor('models:document').create({ _internal: this });
  }

  get documents() {
    return this.context.documentsManager;
  }

  //

  get data() {
    return this._data;
  }

  //

  assignReference(reference, notify) {
    let current = this._reference;
    if(current === reference) {
      return;
    }
    this.withPropertyChanges(notify, changed => {
      reference.assignDocument(this);
      this._reference = reference;
      current && current.destroy();
      changed('id');
      changed('path');
      changed('collection');
      changed('exists');
    });
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

  get exists() {
    return this._reference.exists;
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

  _schedule(name, fn) {
    return this._queue.schedule({ name: `document-${name}`, document: this }, fn);
  }

  //

  didLoad(json) {
    let data = this.data;
    data.withPropertyChanges(true, changed => {
      data.deserialize(json, changed);
    });
    this.withPropertyChanges(true, changed => {
      changed('exists');
    });
  }

  didSave() {
    this.withPropertyChanges(true, changed => {
      changed('exists');
    });
  }

  didCreate(ref) {
    let reference = this.documents.createPersistedReference(ref);
    this.assignReference(reference, true);
  }

  save() {
    return this._schedule('save', () => this._reference.save().then(() => this));
  }

  load() {
    return this._schedule('load', () => this._reference.load().then(() => this));
  }

  //

  willDestroy() {
    this._queue.destroy();
    this._reference.destroy();
    this._data.destroy();
    super.willDestroy();
  }

}
