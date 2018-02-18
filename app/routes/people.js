import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    let context = this.get('store').fork('people');
    return context.query({ id: 'people-by-name', query: db => db.collection('people').orderBy('name', 'asc') }).load();
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
