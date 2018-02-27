import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  model: computed(function() {
    return this.get('store').model({ name: 'thing', data: { info: { name: 'thingie' } } });
  }),

});
