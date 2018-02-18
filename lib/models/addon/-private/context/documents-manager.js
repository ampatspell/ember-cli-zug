import EmberObject from '@ember/object';
import InternalDocument from '../model/internal-document';
import LocalReference from '../model/reference/local-reference';
import PersistedReference from '../model/reference/persisted-reference';
import pathFromOptions from '../util/path-from-options';

export default EmberObject.extend({

  context: null,

  _createInternalData(json) {
    return this.context._internal.data.createInternalObject(json);
  },

  _createLocalReference(id, collection, path) {
    return new LocalReference(id, collection, path);
  },

  createPersistedReference(ref) {
    return new PersistedReference(ref);
  },

  _createInternalDocument(reference, data) {
    let context = this.get('context');
    return new InternalDocument(context, reference, data);
  },

  createNewDocument(props={}) {
    let { id, collection, path, data: data_ } = props;
    let data = this._createInternalData(data_);
    let reference = this._createLocalReference(id, collection, path);
    let internal = this._createInternalDocument(reference, data);
    return internal.model(true);
  },

  _existingInternalDocument(opts, create) {
    let path = pathFromOptions(opts, true);
    let context = this.context._internal;
    let identity = context.identity.documents;
    let internal = identity.persisted(path);
    if(!internal && create) {
      let ref = context.firestore.doc(path);
      let reference = this.createPersistedReference(ref);
      let data = this._createInternalData();
      internal = this._createInternalDocument(reference, data);
      identity.storePersisted(internal);
    }
    return internal;
  },

  createExistingDocument(opts) {
    return this._existingInternalDocument(opts, true).model(true);
  },

  loadExistingDocument(opts) {
    return this.createExistingDocument(opts).load();
  }

});
