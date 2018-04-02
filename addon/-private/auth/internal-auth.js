import Internal from '../model/internal';
import AuthMethods from './internal-methods';
import { resolve } from 'rsvp';
import { join } from '@ember/runloop';
import { assert } from '@ember/debug';
import InternalUser from './internal-user';

export default class InternalAuth extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.methods = new AuthMethods(context, this);
    this._user = undefined;
    this._promise = resolve();
  }

  configure() {
    this.startObservingAuthState();
    this.onUser(this.auth.currentUser);
    return this.settle();
  }

  createModel() {
    return this.context.factoryFor('zug:auth').create({ _internal: this });
  }

  settle() {
    return this._promise;
  }

  //

  get user() {
    return this._user;
  }

  setUser(user, notify) {
    this.withPropertyChanges(notify, changed => {
      this._user = user;
      changed('user');
    })
  }

  scheduleUser(user) {
    this._promise = this._promise.finally(() => {
      let internal = new InternalUser(this.context, this, user);
      return internal.restore().then(() => this.setUser(internal, true));
    });
  }

  onUser(user) {
    let current = this._user;

    if(user) {
      if(current && current.user === user) {
        return;
      }
      this.scheduleUser(user);
    } else {
      if(!current) {
        return;
      }
    }

    this.setUser(null, true);

    if(current) {
      current.destroy();
    }
  }

  //

  get auth() {
    let auth = this._auth;
    if(!auth) {
      let app = this.context.firebase;
      assert(`context should be ready before accessing auth`, !!app);
      auth = app.auth();
      this._auth = auth;
    }
    return auth;
  }

  onAuthStateChanged(user) {
    this.onUser(user);
  }

  startObservingAuthState() {
    this._authStateObserver = this.auth.onAuthStateChanged(user => join(() => this.onAuthStateChanged(user)));
  }

  stopObservingAuthState() {
    this._authStateObserver && this._authStateObserver();
  }

  //

  signOut() {
    return resolve(this.auth.signOut()).then(() => undefined);
  }

  //

  withAuth(fn) {
    let auth = this.auth;
    return resolve(fn(auth));
  }

  withAuthReturningUser(fn) {
    return this.withAuth(fn).then(() => this.settle()).then(() => this.user);
  }

  //

  willDestroy() {
    this.stopObservingAuthState();
    this.methods.destroy();
    this._user && this._user.destroy();
    super.willDestroy();
  }

}
