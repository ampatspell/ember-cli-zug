import Reference from './reference';
import { resolve, reject } from 'rsvp';
import FireError from '../../util/error';

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

  get referenceType() {
    return 'local';
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

  createDocumentRef() {
    let { id, collection } = this;
    let firestore = this.context.firestore;
    let col = firestore.collection(collection);
    return id ? col.doc(id) : col.doc();
  }

  _willSave() {
    this.document.willSave();
  }

  _didSave(ref) {
    this.document.didCreate(ref);
  }

  _saveDidFail(err) {
    console.log('_saveDidFail', this, err);
  }

  isLocallyUnique() {
    let { id, collection, path } = this;
    let existing = this.documents.existingInternalDocument({ id, collection, path });
    return !existing || existing === this.document;
  }

  save() {
    if(!this.isLocallyUnique()) {
      return reject(new FireError({ error: 'conflict', reason: 'document with the same path already exists' }));
    }

    let data = this.document.data.serialize();
    let ref = this.createDocumentRef();

    this._willSave();
    return this.transaction.refSet(ref, data).then(() => this._didSave(ref), err => this._saveDidFail(err));
  }

  load() {
    return resolve();
  }

  delete() {
    return reject(new FireError({ error: 'local', reason: 'document is not yet saved' }));
  }

}
