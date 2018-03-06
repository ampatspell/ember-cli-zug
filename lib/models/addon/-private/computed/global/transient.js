import Property from '../property';

export default class TransientProperty extends Property {

  createInternalModel() {
    let props = this.opts.props;
    return this.context.modelsManager.createNewInternalModel(props);
  }

  getValue() {
    return this.model(true);
  }

}
