import Internal from './internal';

export default class InternalModel extends Internal {

  constructor(context, modelClass) {
    super(context);
    this._modelClass = modelClass;
  }

  createModel() {
    return this._modelClass.create({ _internal: this });
  }

  willDestroy() {
    this.context._internal.models._internalModelWillDestroy(this);
    super.willDestroy();
  }

}
