import EmberObject from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({

  context: null,

  _storage: null,

  init() {
    this._super(...arguments);
    this._storage = {
      all: A(),
    };
  },

  storeInternalModel(internal) {
    let storage = this._storage;
    storage.all.addObject(internal);
  },

  removeInternalModel(internal) {
    let storage = this._storage;
    storage.all.removeObject(internal);
  },

  willDestroy() {
    this._storage.all.map(internal => internal.destroy());
    this._super(...arguments);
  }

});
