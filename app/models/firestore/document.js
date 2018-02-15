import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  store:  null,

  id:     null,
  exists: null,
  path:   null,
  data:   null,

  update(snapshot) {
    this.setProperties({
      id:     snapshot.id,
      exists: snapshot.exists,
      path:   snapshot.ref.path,
      data:   snapshot.data()
    });
  },

  save() {
    return this.get('store')._saveDocument(this);
  },

  toStringExtension() {
    let path = this.get('path');
    return `${path}`;
  },

});
