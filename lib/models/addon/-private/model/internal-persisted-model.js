import InternalModel from './internal-model';

export default class InternalPersistedModel extends InternalModel {

  constructor(context, modelClass, doc) {
    super(context, modelClass);
    this.doc = doc;
  }

  get immutablePath() {
    return this.doc.immutablePath;
  }

  get modelType() {
    return 'persisted';
  }

}
