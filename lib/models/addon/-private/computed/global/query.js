import Property from '../property';
import observeOwnerMixin from '../observer-owner-mixin';

export default class QueryProperty extends observeOwnerMixin(Property) {

  reusable() {
    return true;
  }

  willCreateModel(internal) {
    internal.load();
  }

  createInternalModel() {
    let { id, type, query } = this.opts;
    return this.context.query({ id, type, query });
  }

}
