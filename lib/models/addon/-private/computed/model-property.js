import Property from './property';

export default class ModelProperty extends Property {

  willCreateModel() {
  }

  model(create) {
    let internal = this.internalModel(create);
    if(!internal) {
      return;
    }
    let model = internal.model(false);
    if(!model) {
      this.willCreateModel(internal);
      model = internal.model(true);
    }
    return model;
  }

  getValue() {
    return this.model(true);
  }

}
