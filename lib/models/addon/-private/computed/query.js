import Property from './property';
import observeOwnerMixin from './observer-owner-mixin';

export default class QueryProperty extends observeOwnerMixin(Property) {

  get ownerObservationKeys() {
    return this.opts.owner;
  }

  willCreateModel(internal) {
    internal.load();
  }

  createInternalModel() {
    let { id, query } = this.opts;
    return this.context._internal.query({ id, query });
  }

}
