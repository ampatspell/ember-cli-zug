import Property from '../property';

export default class ForkProperty extends Property {

  createInternalModel() {
    let name = this.opts.name;
    return this.context.fork(name);
  }

  getValue() {
    return this.model(true);
  }

  destroyInternal(internal) {
    internal.settle().then(() => internal.destroy());
  }

}
