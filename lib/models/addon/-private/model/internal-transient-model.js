import InternalModel from './internal-model';

export default class InternalTransientModel extends InternalModel {

  constructor(context, modelClass, persistentPath, props) {
    super(context, modelClass);
    this.persistentPath = persistentPath;
    this.props = props;
  }

}
