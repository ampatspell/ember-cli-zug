import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  model: null,
  person: readOnly('model.person'),

  actions: {
    save() {
      let person = this.get('person');
      person.incrementProperty('version');
      person.save();
    },
    cancel() {
      // Transition absolutely requires person.id as this model is in `person-edit` context
      this.get('router').transitionTo('people.person', this.get('person.id'));
    }
  }

});
