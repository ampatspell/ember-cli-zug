import Internal from './internal';
import QueryLoader from './query-loader';
import QueryState from './query-state';

export default class InternalQuery extends Internal {

  constructor(context, opts) {
    super();
    this.context = context;
    this.opts = opts;
    this.state = new QueryState(this);
    this.loader = new QueryLoader(context, opts, {
      onLoading: () => this.onLoading(),
      onLoaded: () => this.onLoaded(),
      onError: err => this.onError(err)
    });
  }

  get id() {
    return this.opts.id;
  }

  load() {
    return this.loader.load();
  }

  createModel() {
    return this.context.factoryFor('models:query').create({ _internal: this, content: this.loader.content });
  }

  withState(cb) {
    this.withPropertyChanges(true, changed => cb(this.state, changed));
  }

  onLoading() {
    this.withState((state, changed) => state.onLoading(changed));
  }

  onLoaded() {
    this.withState((state, changed) => state.onLoaded(changed));
  }

  onError(err) {
    this.withState((state, changed) => state.onError(err, changed));
  }

  willDestroy() {
    this.loader.destroy();
    this.context.queriesManager.removeInternalQuery(this);
    super.willDestroy();
  }

}
