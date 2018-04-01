import Internal from '../../model/internal';
import AuthMethods from './internal-method';
import { resolve } from 'rsvp';

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

  get user() {
    return this.auth.user;
  }

  withAuth(fn) {
    let auth = this.auth.auth;
    return resolve(fn(auth));
  }

  withAuthReturningUser(fn) {
    return this.withAuth(fn).then(() => this.user);
  }

}
