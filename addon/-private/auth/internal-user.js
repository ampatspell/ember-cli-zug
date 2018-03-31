import Internal from '../model/internal';

export default class InternalUser extends Internal {

  constructor(context, auth, user) {
    super();
    this.context = context;
    this.auth = auth;
    this.user = user;
  }

  createModel() {
    return this.context.factoryFor('zug:auth/user').create({ _internal: this });
  }

}
