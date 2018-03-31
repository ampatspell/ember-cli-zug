import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  actions: {
    signIn() {
      console.log('sign in');
      this.get('store.auth.methods.anonymous').signIn();
    },
    signOut() {
      console.log('sign out');
      this.get('store.auth').signOut();
    }
  }

});
