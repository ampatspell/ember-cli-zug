import Component from '@ember/component';
import { transient, nest } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud' ],

  context: nest({
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
    done() {
      this.get('crud').done();
    }
  }

});
