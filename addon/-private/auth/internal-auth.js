import Internal from '../model/internal';
import AuthMethods from './internal-methods';
import firebase from 'firebase';
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
  }

  onContextReady() {
    this.startObservingAuthState();
    this.onUser(this.auth.currentUser);
  }

  createModel() {
    return this.context.factoryFor('zug:auth').create({ _internal: this });
  }

  //

  get user() {
    return this._user;
  }

  onUser(user) {
    let current = this._user;
    let next;

    if(user) {
      if(current && current.user === user) {
        return;
      }
      next = new InternalUser(this.context, this, user);
    } else {
      if(!current) {
        return;
      }
      next = null;
    }

    this.withPropertyChanges(true, changed => {
      this._user = next;
      changed('user');
    });

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
      auth = firebase.auth(app);
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

  willDestroy() {
    this.stopObservingAuthState();
    this.methods.destroy();
    this._user && this._user.destroy();
    super.willDestroy();
  }

}
