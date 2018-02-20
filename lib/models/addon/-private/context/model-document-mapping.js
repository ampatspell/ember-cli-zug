import { assert } from '@ember/debug';

const key = '__internal_persisted_model';

export default class ModelDocumentMapping {

  assign(document, internal) {
    assert(`document has already model associated`, !document[key]);
    document[key] = internal;
  }

  unassign(internal) {
    let document = internal.doc;
    if(!document) {
      return;
    }
    delete document[key];
  }

  modelForDocument(document) {
    return document[key];
  }

}
