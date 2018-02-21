import InternalModel from './internal-model';

export default class InternalTransientModel extends InternalModel {

  constructor(context, modelClass, path, props) {
    super(context, modelClass);
    this.props = props;
    this._path = path;
  }

  get immutablePath() {
    return this._path;
  }

  get modelType() {
    return 'transient';
  }

}
