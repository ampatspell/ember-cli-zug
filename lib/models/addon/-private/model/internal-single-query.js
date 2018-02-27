import InternalQuery from './internal-query';
import { isDocumentReference, isQueryOrCollectionReference } from '../util/firestore-types';
import QueryFirstObserver from './observer/query-first-observer';
import DocumentObserver from './observer/document-observer';

export default class InternalSingleQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
  }

  get type() {
    return 'single';
  }

  get content() {
    return this.observer.content;
  }

  createModel() {
    return this.context.factoryFor('models:query/single').create({ _internal: this });
  }

  createObserver(query, delegate) {
    if(isQueryOrCollectionReference(query)) {
      return new QueryFirstObserver(query, delegate);
    } else if(isDocumentReference(query)) {
      return new DocumentObserver(query, delegate);
    }

    return {};
  }

}
