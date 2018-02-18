import Route from '@ember/routing/route';

export default Route.extend({

  model(props) {
    let query = this.modelFor('people');
    return query.get('content').findBy('id', props.person_id);
  }

});
