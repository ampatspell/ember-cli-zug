import Component from '@ember/component';
import { transient, fork } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud' ],

  context: fork({
    context: 'store',
    name: 'crud'
  }),

  crud: transient({
    props: { name: 'crud/main' }
  }),

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
