import Internal from '../model/internal';

export default class InternalMetadata extends Internal {

  constructor(context, reference) {
    super();
    this.context = context;
    this.reference = reference;
  }

  createModel() {
    return this.context.factoryFor('zug:storage/metadata').create({ _internal: this });
  }

}
