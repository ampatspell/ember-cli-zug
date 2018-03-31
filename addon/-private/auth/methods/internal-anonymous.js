import Method from './internal-method';
import { resolve } from 'rsvp';

export default class InternalAnonymous extends Method {

  get type() {
    return 'anonymous';
  }

  onSignedIn(res) {
    let { additionalUserInfo, user } = res;
    console.log('onSignedIn', additionalUserInfo, user);
  }

  signIn() {
    let auth = this.auth.auth;
    return resolve(auth.signInAnonymouslyAndRetrieveData()).then(res => this.onSignedIn(res));
  }

}
