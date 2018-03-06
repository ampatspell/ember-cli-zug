import Component from '@ember/component';
import { computed } from '@ember/object';
import { transient } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud' ],

  context: computed(function() {
    return this.get('store').fork('crud');
  }).readOnly(),

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
      this.set('crud.selection', model);
    }
  }

});
