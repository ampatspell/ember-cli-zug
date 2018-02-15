import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    let context = this.get('store').fork('people');
    let query = context.query({ id: 'people-by-name', query: db => db.collection('people').orderBy('name', 'asc') });
    return query.load().then(() => {
      return {
        context,
        query
      };
    });
  },

  deactivate() {
    this.currentModel.context.destroy();
  }

});
