import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud' ],

  context: computed(function() {
    return this.get('store').fork('crud');
  }).readOnly(),

  willDestroy() {
    this.get('context').destroy();
    this._super();
  },

  selection: null,

  actions: {
    select(model) {
      this.set('selection', model);
    }
  }

});
