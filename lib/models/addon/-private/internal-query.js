import Internal from './internal';
import QueryLoader from './query-loader';

export default class InternalQuery extends Internal {

  constructor(context, queries, opts) {
    super(context);
    this.queries = queries;
    this.opts = opts;
    this.loader = new QueryLoader(context, opts);
  }

  get identifier() {
    return this.opts.id;
  }

  load() {
    return this.loader.load();
  }

  createModel() {
    return this.factoryFor('models:query').create({ _internal: this, content: this.loader.content });
  }

  willDestroy() {
    console.log('willDestroy', this);
    this.loader.destroy();
    this.queries.removeQuery(this);
    super.willDestroy();
  }

}
