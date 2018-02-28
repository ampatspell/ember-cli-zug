import Property from '../property';
import observeOwnerMixin from '../observer-owner-mixin';

export default class MatchProperty extends observeOwnerMixin(Property) {

  get isReusable() {
    return true;
  }

  createInternalModel() {
    let { type, model, matches } = this.opts;
    let owner = this.owner;
    return this.context.matcher({
      type,
      model,
      matches: model => matches(model, owner),
      didUpdate: () => this.notifyPropertyChange()
    });
  }

  getValue() {
    return this.internalModel(true).content;
  }

}
