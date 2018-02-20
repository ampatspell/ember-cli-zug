import Component from '@ember/component';

export default Component.extend({

  actions: {
    select(person) {
      this.get('router').transitionTo('people.person', person);
    }
  }

});
