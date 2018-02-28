import { assert } from '@ember/debug';
import InternalQuery from './internal-query';
import QueryArrayObserver from './observer/query-array-observer';
import DocumentArrayObserver from './observer/document-array-observer';
import { isDocumentReference, isQueryOrCollectionReference } from '../util/firestore-types';

export default class InternalArrayQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
  }

  get type() {
    return 'array';
  }

  createObserver(query, delegate) {
    if(isQueryOrCollectionReference(query)) {
      return new QueryArrayObserver(query, delegate);
    } else if(isDocumentReference(query)) {
      return new DocumentArrayObserver(query, delegate);
    }
    assert(`array query opts.query result must be Query, CollectionReference or DocumentReference`, false);
  }

}
