import Reference from './reference';

const maybeSet = (instance, key, value) => {
  if(value) {
    instance[key] = value;
  }
};

export default class LocalReference extends Reference {

  constructor(id, collection, path) {
    super();
    maybeSet(this, 'id', id);
    maybeSet(this, 'collection', collection);
    maybeSet(this, 'path', path);
  }

  get id() {
    return this._id;
  }

  get collection() {
    return this._collection;
  }

  get path() {
    return this._path;
  }

  _recalculatePath() {
    let { id, collection } = this;
    let path;
    if(id && collection) {
      path = `${collection}/${id}`;
    }
    this.withDocumentPropertyChanges(true, changed => {
      if(this._path !== path) {
        this._path = path;
        changed('path');
      }
    });
  }

  _recalculateIdAndCollection() {
    let path = this.path;
    let id;
    let collection;
    if(path) {
      let idx = path.lastIndexOf('/');
      collection = path.substr(0, idx);
      id = path.substr(idx + 1, path.length);
    }
    this.withDocumentPropertyChanges(true, changed => {
      if(this._id !== id) {
        this._id = id;
        changed('id');
      }
      if(this._collection !== collection) {
        this._collection = collection;
        changed(collection);
      }
    });
  }

  set id(value) {
    this._id = value;
    this._recalculatePath();
  }

  set collection(value) {
    this._collection = value;
    this._recalculatePath();
  }

  set path(value) {
    this._path = value;
    this._recalculateIdAndCollection();
  }

}
