import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  actions: {
    signIn() {
      this.get('store.auth.methods.anonymous').signIn();
    },
    signOut() {
      this.get('store.auth').signOut();
    }
  }

});
