import Internal from '../model/internal';

export default class AuthMethods extends Internal {

  constructor(context, auth) {
    super();
    this.context = context;
    this.auth = auth;
  }

  createModel() {
    return this.context.factoryFor('zug:auth/methods').create({ _internal: this });
  }

}