import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.get('store').nest('match');
  },

  deactivate() {
    this.get('currentModel').destroy();
  }

});
