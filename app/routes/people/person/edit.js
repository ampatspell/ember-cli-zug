import Route from '@ember/routing/route';
import NestMixin from 'thing/mixins/route/nest';

export default Route.extend(NestMixin, {

  context: 'person-edit',

  model() {
    let id = this.modelFor('people.person').get('id');
    let model = this.nest().model({ name: 'person/edit', data: { id } });
    return model.load();
  }

});
