import Property from '../property';
import observeOwnerMixin from '../observer-owner-mixin';

export default class MatchProperty extends observeOwnerMixin(Property) {

  reusable() {
    return true;
  }

  createInternalModel() {
    console.log(this.opts);
    console.log(this.context+'');
    // let { id, type, query } = this.opts;
    // return this.context._internal.query({ id, type, query });
  }

}
