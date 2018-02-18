import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    let id = this.modelFor('people.person').get('id');
    let context = this.modelFor('people').get('context').fork('person-edit');
    let query = context.query({ id: 'person-by-id', query: db => db.collection('people').where('__name__', '==', id) });
    return query.load();
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
