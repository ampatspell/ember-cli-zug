import Internal from '../model/internal';

export default class Auth extends Internal {

  constructor(context) {
    super();
    this.context = context;
  }

  createModel() {
    return this.context.factoryFor('zug:auth').create({ _internal: this });
  }

}