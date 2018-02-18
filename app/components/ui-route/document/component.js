import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  keys: computed('document', function() {
    let data = this.get('document.data.serialized');
    let keys = [];
    for(let key in data) {
      let value = data[key];
      if(typeof value === 'string') {
        keys.push({ name: key, type: 'input' });
      }
    }
    return keys;
  }),

  actions: {
    save() {
      let doc = this.get('document');
      doc.save();
    }
  }

});
