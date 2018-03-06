import Property from '../property';

export default class TransientProperty extends Property {

  createInternalModel() {
    let opts = this.opts.create(this.owner);
    return this.context.modelsManager.createNewInternalModel(opts);
  }

  getValue() {
    return this.model(true);
  }

}
