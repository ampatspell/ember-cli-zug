import EmberObject from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({

  context: null,

  _storage: null,

  init() {
    this._super(...arguments);
    this._storage = {
      all:     A(),
      new:     A(),
      persisted: Object.create(null)
    };
  },

  persisted(path) {
    let storage = this._storage;
    return storage.persisted[path];
  },

  storePersisted(internal) {
    let storage = this._storage;
    let path = internal.path;
    storage.new.removeObject(internal);
    storage.all.addObject(internal);
    storage.persisted[path] = internal;
  },

  willDestroy() {
    this._storage.all.map(internal => internal.destroy());
    this._super(...arguments);
  }

});
