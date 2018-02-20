import { A } from '@ember/array';
import Destroyable from '../model/destroyable';
import InternalQuery from '../model/internal-query';

export default class QueriesManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.queries = A();
  }

  createInternalQuery(opts) {
    let internal = new InternalQuery(this.context, opts);
    this.queries.pushObject(internal);
    return internal;
  }

  removeInternalQuery(query) {
    this.queries.removeObject(query);
  }

  willDestroy() {
    this.queries.map(query => query.destroy());
    super.willDestroy();
  }

}
