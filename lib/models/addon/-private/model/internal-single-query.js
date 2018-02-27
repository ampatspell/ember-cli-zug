import InternalQuery from './internal-query';

export default class InternalSingleQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
  }

  get type() {
    return 'single';
  }

  createModel() {
    return this.context.factoryFor('models:query').create({ _internal: this, content: null });
  }

  createObserver() {
    return {};
  }

}
