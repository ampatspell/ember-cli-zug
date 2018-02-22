import Property from './property';

export default class QueryProperty extends Property {

  willCreateModel(internal) {
    internal.load();
  }

  createInternalModel() {
    let { id, query } = this.opts;
    return this.context._internal.query({ id, query });
  }

}
