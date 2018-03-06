import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud-detail-selection' ],

  componentName: computed('selection.modelName', function() {
    let modelName = this.get('selection.modelName');
    if(!modelName) {
      return;
    }
    return `ui-route/crud/detail/selection/${modelName}`;
  }).readOnly(),

});
