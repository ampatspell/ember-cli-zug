import Component from '@ember/component';

export default Component.extend({

  person: null,

  actions: {
    save() {
      let person = this.get('person');
      person.incrementProperty('version');
      person.save();
    },
    edit() {
      this.get('router').transitionTo('people.person.edit', this.get('person'));
    }
  }

});
