import Internal from './internal';
import QueryState from './query-state';

export default class InternalQuery extends Internal {

  constructor(context, opts) {
    super();
    this.context = context;
    this.opts = opts;
    this.state = new QueryState(this);
    this.loader = this.createLoader();
  }

  get id() {
    return this.opts.id;
  }

  load() {
    return this.loader.load();
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
