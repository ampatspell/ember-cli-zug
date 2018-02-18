import Component from '@ember/component';

export default Component.extend({

  actions: {
    save() {
      let person = this.get('person');
      person.incrementProperty('data.version');
      person.save();
    },
    cancel() {
      // Transition absolutely requires person.id as this model is in `person-edit` context
      this.get('router').transitionTo('people.person', this.get('person.id'));
    }
  }

});
