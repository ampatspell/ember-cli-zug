import Internal from '../model/internal';

export default class InternalUser extends Internal {

  constructor(context, auth) {
    super();
    this.context = context;
    this.auth = auth;
  }

}