import Internal from '../model/internal';
import AuthMethods from './internal-methods';
import firebase from 'firebase';
import { resolve } from 'rsvp';

export default class Auth extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.methods = new AuthMethods(context, this);
  }

  createModel() {
    return this.context.factoryFor('zug:auth').create({ _internal: this });
  }

  //

  get auth() {
    let auth = this._auth;
    if(!auth) {
      let app = this.context.firebase;
      auth = firebase.auth(app);
      this._auth = auth;
    }
    return auth;
  }

  signOut() {
    return resolve(this.auth.signOut()).then(() => undefined);
  }

  //

  willDestroy() {
    this.methods.destroy();
    super.willDestroy();
  }

}
