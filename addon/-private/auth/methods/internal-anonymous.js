import Method from './internal-method';

export default class InternalAnonymous extends Method {

  signIn() {
    return this.withAuthReturningUser(auth => auth.signInAnonymouslyAndRetrieveData());
  }

}
