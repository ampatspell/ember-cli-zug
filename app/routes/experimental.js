import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.get('store').fork('experimental');
  },

  deactivate() {
    this.get('currentModel').destroy();
  }

});
