import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  componentNamePrefix: null,

  componentName: computed('componentNamePrefix', 'selection.type', function() {
    let type = this.get('selection.type');
    if(!type) {
      return;
    }
    let prefix = this.get('componentNamePrefix');
    return `ui-route/crud/detail/${prefix}/${type}`;
  }).readOnly(),

});
