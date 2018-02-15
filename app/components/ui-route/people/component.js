import Component from '@ember/component';

export default Component.extend({

  actions: {
    select(doc) {
      this.get('router').transitionTo('people.person', doc);
    }
  }

});
