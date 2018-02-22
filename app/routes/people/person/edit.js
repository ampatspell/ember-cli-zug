import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    let id = this.modelFor('people.person').get('id');
    let context = this.get('store').fork('person-edit');
    let model = context.model({ name: 'person/edit', data: { id } });
    return model.load();
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
