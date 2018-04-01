import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  actions: {
    signInAnonymous() {
      this.willSignIn();
      this.get('store.auth.methods.anonymous').signIn();
    },
    signInEmail(email, password) {
      this.willSignIn();
      this.get('store.auth.methods.email').signIn(email, password).catch(err => {
        this.signInDidFail(err);
      });
    },
    signOut() {
      this.get('store.auth').signOut();
    }
  },

  willSignIn() {
    this.set('error', null);
  },

  signInDidFail(err) {
    if(this.isDestroying) {
      return;
    }
    this.set('error', err);
  }

});
