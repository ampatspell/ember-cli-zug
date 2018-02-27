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
    return this.context.factoryFor('models:query').create({ _internal: this, content: this.observer.content });
  }

  createObserver() {
    let query = this.query;

    let delegate = {
      onLoading: () => this.onLoading(),
      onLoaded: () => this.onLoaded(),
      createModel: snapshot => this.modelForSnapshot(snapshot),
      updateModel: model => model,
      destroyModel: () => {}
    };

    if(isQueryOrCollectionReference(query)) {
      return new QueryArrayObserver(query, delegate);
    } else if(isDocumentReference(query)) {
      return new DocumentArrayObserver(query, delegate);
    }
  }

}
