import Internal from '../model/internal';

export default class InternalUser extends Internal {

  constructor(context, auth) {
    this.context = context;
    this.auth = auth;
  }

}