import Component from '@ember/component';

export default Component.extend({

  collection: null,

  actions: {
    select(model) {
      let select = this.get('select');
      select && select(model);
    }
  }

});
