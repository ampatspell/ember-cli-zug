import { assert } from '@ember/debug'
import { isDocumentReference, isCollectionReference, isQuery } from './firestore-types';

class Selector {}

class PathSelector extends Selector {

  constructor(arg) {
    super();
    this.opts = arg;
  }

  get type() {
    return 'path';
  }

}

class DocumentRefSelector extends Selector {

  constructor(result) {
    super();
    this.ref = result;
  }

  get type() {
    return 'document-ref';
  }

}

class CollectionRefSelector extends Selector {

  constructor(result) {
    super();
    this.ref = result;
  }

  get type() {
    return 'collection-ref';
  }

}

class QuerySelector extends Selector {

  constructor(result) {
    super();
    this.query = result;
  }

  get type() {
    return 'query';
  }

}

export default (arg, firestore) => {
  if(typeof arg === 'function') {
    let result = arg(firestore);
    if(isDocumentReference(result)) {
      return new DocumentRefSelector(result);
    }
    if(isCollectionReference(result)) {
      return new CollectionRefSelector(result);
    }
    if(isQuery(result)) {
      return new QuerySelector(result);
    }
    assert(`selector must return DocumentReference, CollectionReference or Query`, false);
  } else {
    return new PathSelector(arg);
  }
}
