import InternalQuery from './internal-query';

export default class InternalSingleQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
  }

  get type() {
    return 'single';
  }

  createLoader() {
    return {
      load() {}
    };
    // return new QueryArrayLoader(this.context, this.opts, {
    //   onLoading: () => this.onLoading(),
    //   onLoaded: () => this.onLoaded(),
    //   onError: err => this.onError(err)
    // });
  }

  createModel() {
    return this.context.factoryFor('models:query').create({ _internal: this, content: null });
  }

}
