import Internal from '../model/internal';
import { resolve } from 'rsvp';

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

  onDeleted() {
    this.auth.onUser(null);
  }

  delete() {
    return resolve(this.user.delete()).then(() => this.onDeleted());
  }

}
