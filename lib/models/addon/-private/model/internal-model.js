import Internal from './internal';
import { assign } from '@ember/polyfills';

export default class InternalModel extends Internal {

  constructor(context, modelClass) {
    super();
    this.context = context;
    this.modelClass = modelClass;
    this.props = null;
  }

  createModel() {
    let model = this.modelClass.create(assign({ _internal: this }, this.props));
    this.props = null;
    return model;
  }

  willDestroy() {
    this.context._internal.models._internalModelWillDestroy(this);
    super.willDestroy();
  }

}
