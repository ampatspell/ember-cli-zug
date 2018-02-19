import Reference from './reference';
import { resolve } from 'rsvp';

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

  _recalculatePath() {
    let id = this._id;
    let collection = this._collection;
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
    let path = this._path;
    let id;
    let collection;

    if(path) {
      let idx = path.lastIndexOf('/');
      if(idx === -1) {
        collection = path;
      } else {
        collection = path.substr(0, idx);
        id = path.substr(idx + 1, path.length);
      }
    }

    this.withDocumentPropertyChanges(true, changed => {
      if(this._id !== id) {
        this._id = id;
        changed('id');
      }
      if(this._collection !== collection) {
        this._collection = collection;
        changed('collection');
      }
    });
  }

  //

  _buildDocumentRef() {
    let { id, collection } = this;
    let firestore = this.context._internal.firestore;
    let col = firestore.collection(collection);
    return id ? col.doc(id) : col.doc();
  }

  _didSave(ref) {
    // console.log('_didSave', ref, this);
    this.document.didCreate(ref);
  }

  _saveDidFail() {
    // console.log('_saveDidFail', err);
  }

  save() {
    let data = this.document.data.serialize();
    let ref = this._buildDocumentRef();
    // let path = ref.path;
    // if(identity.exists(path)) {
    //   reject
    // }
    let transaction = this.transaction;
    return transaction.refSet(ref, data).then(() => this._didSave(ref), err => this._saveDidFail(err));
  }

  load() {
    return resolve();
  }

}
