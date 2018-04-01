import Method from './internal-method';

export default class InternalEmail extends Method {

  signIn(email, password) {
    return this.withAuthReturningUser(auth => auth.signInAndRetrieveDataWithEmailAndPassword(email, password));
  }

  signUp(email, password) {
    return this.withAuthReturningUser(auth => auth.createUserAndRetrieveDataWithEmailAndPassword(email, password));
  }

}
