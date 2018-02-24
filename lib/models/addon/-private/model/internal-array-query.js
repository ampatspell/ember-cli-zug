import InternalQuery from './internal-query';
import QueryArrayLoader from './query-array-loader';

export default class InternalArrayQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
  }

  get type() {
    return 'array';
  }

  createLoader() {
    return new QueryArrayLoader(this.context, this.opts, {
      onLoading: () => this.onLoading(),
      onLoaded: () => this.onLoaded(),
      onError: err => this.onError(err)
    });
  }

  createModel() {
    return this.context.factoryFor('models:query').create({ _internal: this, content: this.loader.content });
  }

}
