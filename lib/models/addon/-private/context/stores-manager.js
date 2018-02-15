import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { array } from '../util/computed';

export default EmberObject.extend({

  stores: null,
  instantiated: array(),

  createStore(identifier, opts) {
    let stores = this.get('stores');
    let store = getOwner(this).factoryFor('models:store').create({ stores, identifier, opts });
    this.get('instantiated').pushObject(store);
    return store;
  },

  removeStore(store) {
    this.get('instantiated').removeObject(store);
  },

  willDestroy() {
    this.get('instantiated').map(store => store.destroy());
    this._super(...arguments);
  }

});
