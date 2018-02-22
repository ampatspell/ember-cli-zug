import Property from './property';
import observeOwnerMixin from './observer-owner-mixin';

export default class QueryProperty extends observeOwnerMixin(Property) {

  willCreateModel(internal) {
    internal.load();
  }

  createInternalModel() {
    let { id, query } = this.opts;
    return this.context._internal.query({ id, query });
  }

}
