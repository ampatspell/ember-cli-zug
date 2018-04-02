import Component from '@ember/component';
import { makeID } from 'ember-cli-zug/utils';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  actions: {
    update(file) {
      this.set('file', file);
    },
    upload() {
      let file = this.get('file');
      if(!file) {
        return;
      }
      let id = makeID();
      let ref = this.get('store.storage').ref({ path: `experimental/${id}` });
      let task = ref.put({ type: 'data', data: file, metadata: { contentType: file.type } });
      this.set('task', task);
    }
  }

});
