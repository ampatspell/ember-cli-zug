import Property from '../property';

export default class NestProperty extends Property {

  createInternalModel() {
    let name = this.opts.name;
    return this.context.nest(name);
  }

  getValue() {
    return this.model(true);
  }

  destroyInternal(internal) {
    internal.settle().then(() => internal.destroy());
  }

}
