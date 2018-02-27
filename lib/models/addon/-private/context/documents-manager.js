import Destroyable from '../model/destroyable';
import LocalReference from '../model/reference/local-reference';
import PersistedReference from '../model/reference/persisted-reference';
import InternalDocument from '../model/internal-document';
import pathFromOptions from '../util/path-from-options';

export default class DocumentsManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
  }

  createInternalData(json) {
    return this.context.dataManager.createInternalObject(null, json);
  }

  createLocalReference({ id, collection, path }) {
    return new LocalReference(id, collection, path);
  }

  createPersistedReferenceWithRef(ref) {
    return new PersistedReference(ref);
  }

  createPersistedReferenceWithPath(path) {
    let ref = this.context.firestore.doc(path);
    return this.createPersistedReferenceWithRef(ref);
  }

  createInternalDocument(reference, data, state) {
    return new InternalDocument(this.context, reference, data, state);
  }

  // { id, collection, path, data }
  createNewInternalDocument(opts) {
    let reference = this.createLocalReference(opts);
    let data = this.createInternalData(opts.data);
    let internal = this.createInternalDocument(reference, data);
    this.context.identity.documents.storeLocalInternalDocument(internal);
    return internal;
  }

  // { id, collection, path, data, create }
  existingInternalDocument(opts) {
    let path = pathFromOptions(opts);
    let identity = this.context.identity.documents;
    let internal = identity.persistedInternalDocument(path);
    if(!internal && opts.create) {
      let reference = this.createPersistedReferenceWithPath(path);
      let data = this.createInternalData(opts.data);
      internal = this.createInternalDocument(reference, data, { isDirty: false, isLoading: true, isLoaded: false });
      identity.storePersistedInternalDocument(internal);
    }
    return internal;
  }

  loadedInternalDocument(ref, exists, json) {
    let path = ref.path;
    let identity = this.context.identity.documents;
    let internal = identity.persistedInternalDocument(path);
    if(!internal) {
      let reference = this.createPersistedReferenceWithRef(ref);
      let data = this.createInternalData(json);
      internal = this.createInternalDocument(reference, data, { isDirty: false, isLoading: false, isLoaded: true, isExisting: exists });
      identity.storePersistedInternalDocument(internal);
    }
    return internal;
  }

  loadedInternalDocumentForSnapshot(snapshot) {
    let ref = snapshot.ref;
    let exists = snapshot.exists;
    let data = snapshot.data();
    return this.loadedInternalDocument(ref, exists, data);
  }

  localInternalDocumentDidSave(internal) {
    let context = this.context;
    context.identity.documents.storePersistedInternalDocument(internal);
    context.localInternalDocumentDidSave(internal);
  }

  internalDocumentWillDestroy(internal) {
    let context = this.context;
    context.identity.documents.removeInternalDocument(internal);
    context.internalDocumentWillDestroy(internal);
  }

}
