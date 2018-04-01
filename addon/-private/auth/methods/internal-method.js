import Internal from '../../model/internal';

export default class InternalMethod extends Internal {

  constructor(type, context, auth) {
    super();
    this.type = type;
    this.context = context;
    this.auth = auth;
  }

  createModel() {
    let type = this.type;
    return this.context.factoryFor(`zug:auth/methods/${type}`).create({ _internal: this });
  }

  //

  withAuthReturningUser(fn) {
    return this.auth.withAuthReturningUser(fn);
  }

}
