import Internal from '../model/internal';

export default class InternalReference extends Internal {

  constructor(context, storage, ref) {
    super();
    this.context = context;
    this.storage = storage;
    this.ref = ref;
  }

  createModel() {
    return this.context.factoryFor('zug:storage/reference').create({ _internal: this });
  }

}
