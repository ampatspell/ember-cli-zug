import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-json' ],

  string: computed('value', function() {
    let value = this.get('value');
    return JSON.stringify(value, null, 2);
  })

}).reopenClass({
  positionalParams: [ 'value' ]
});
