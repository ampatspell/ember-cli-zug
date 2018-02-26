import { A } from '@ember/array';
import { assert } from '@ember/debug';
import Destroyable from '../model/destroyable';
import InternalSingleQuery from '../model/internal-single-query';
import InternalArrayQuery from '../model/internal-array-query';

export default class QueriesManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.queries = A();
  }

  _internalQueryFactoryForOptions(opts={}) {
    let { type } = opts;
    if(type === 'single') {
      return InternalSingleQuery;
    } else if(type === 'array') {
      return InternalArrayQuery;
    }
    assert(`query opts.type must be 'single' or 'array'`, false);
  }

  createInternalQuery(opts={}) {
    let factory = this._internalQueryFactoryForOptions(opts);
    let internal = new factory(this.context, opts);
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
