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

  createModel() {
    return this.context.factoryFor('models:query/array').create({ _internal: this, content: this.observer.content });
  }

  createObserver(query, delegate) {
    if(isQueryOrCollectionReference(query)) {
      return new QueryArrayObserver(query, delegate);
    } else if(isDocumentReference(query)) {
      return new DocumentArrayObserver(query, delegate);
    }
  }

}
