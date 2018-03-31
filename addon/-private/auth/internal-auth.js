import Internal from '../model/internal';
import AuthMethods from './internal-methods';
import firebase from 'firebase';

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

  willDestroy() {
    this.methods.destroy();
    super.willDestroy();
  }

}
