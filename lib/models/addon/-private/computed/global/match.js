import Property from '../property';

export default class MatchProperty extends Property {

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
