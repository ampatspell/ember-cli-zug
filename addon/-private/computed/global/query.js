import Property from '../property';

export default class QueryProperty extends Property {

  willCreateModel(internal) {
    internal.load();
  }

  createInternalModel() {
    let { id, type, query } = this.opts;
    return this.context.query({ id, type, query });
  }

  getValue() {
    return this.model(true);
  }

}
