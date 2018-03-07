import Component from '@ember/component';
import { transient, fork } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud' ],

  context: fork({
    context: 'store',
    name: 'crud'
  }),

  crud: transient({
    create() {
      return { name: 'crud/main' };
    }
  }),

  willDestroy() {
    this.get('context').destroy();
    this._super();
  },

  actions: {
    select(model) {
      this.get('crud').select(model);
    },
    edit(model) {
      this.get('crud').edit(model);
    },
    save(model) {
      this.get('crud').save(model);
    },
    cancel(model) {
      this.get('crud').cancel(model);
    }
  }

});
