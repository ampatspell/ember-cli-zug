import { assert } from '@ember/debug'
import firebase from 'firebase';

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
    if(result instanceof firebase.firestore.DocumentReference) {
      return new DocumentRefSelector(result);
    }
    if(result instanceof firebase.firestore.CollectionReference) {
      return new CollectionRefSelector(result);
    }
    if(result instanceof firebase.firestore.Query) {
      return new QuerySelector(result);
    }
    assert(`selector must return documentRef, collectionRef or query`, false);
  } else {
    return new PathSelector(arg);
  }
}
