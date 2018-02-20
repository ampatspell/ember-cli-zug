import Internal from './internal';
import QueryLoader from './query-loader';

export default class InternalQuery extends Internal {

  constructor(context, opts) {
    super();
    this.context = context;
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
    return this.context.factoryFor('models:query').create({ _internal: this, content: this.loader.content });
  }

  willDestroy() {
    console.log('willDestroy', this);
    this.loader.destroy();
    this.context.queriesManager.removeInternalQuery(this);
    super.willDestroy();
  }

}
