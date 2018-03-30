import Route from '@ember/routing/route';

// const hideLoadingIndicator = () => document.getElementById('loading').remove();

export default Route.extend({

  beforeModel() {
    return this.get('store.ready');
  },

  activate() {
    this._super(...arguments);
    // hideLoadingIndicator();
  }

});
