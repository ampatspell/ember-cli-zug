import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud-detail-selection' ],

  componentName: computed('selection.type', function() {
    let type = this.get('selection.type');
    if(!type) {
      return;
    }
    return `ui-route/crud/detail/selection/${type}`;
  }).readOnly(),

});
