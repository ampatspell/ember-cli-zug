import Component from '@ember/component';

export default Component.extend({

  person: null,

  actions: {
    save() {
      this.get('person').save();
    },
    edit() {
      this.get('router').transitionTo('people.person.edit', this.get('person'));
    }
  }

});
