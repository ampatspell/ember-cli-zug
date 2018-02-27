import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.get('store').fork('queries');
  },

  deactivate() {
    this.get('currentModel').destroy();
  }

});
