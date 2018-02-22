import Route from '@ember/routing/route';
import ForkMixin from 'models/mixins/route/fork';

export default Route.extend(ForkMixin, {

  context: 'person-edit',

  model() {
    let id = this.modelFor('people.person').get('id');
    let model = this.fork().model({ name: 'person/edit', data: { id } });
    return model.load();
  }

});
