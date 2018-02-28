import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.get('store').fork('match');
  },

  deactivate() {
    this.get('currentModel').destroy();
  }

});
