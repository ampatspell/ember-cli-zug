import InternalModel from './internal-model';

export default class InternalTransientModel extends InternalModel {

  constructor(context, modelClass, props) {
    super(context, modelClass);
    this.props = props;
  }

  get modelType() {
    return 'transient';
  }

}
