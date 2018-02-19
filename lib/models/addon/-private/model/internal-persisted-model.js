import InternalModel from './internal-model';

export default class InternalPersistedModel extends InternalModel {

  constructor(context, modelClass, doc) {
    super(context, modelClass);
    this._doc = doc;
  }

  get doc() {
    return this._doc;
  }

}
