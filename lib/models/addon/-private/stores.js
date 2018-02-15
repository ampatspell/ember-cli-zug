import EmberObject from '@ember/object';
import { Internal, makeInternalMixin } from './util/make-internal-mixin';

class StoresInternal extends Internal {

  constructor(owner) {
    super(owner);
    this.manager = this.factoryFor('models:stores-manager').create({ stores: this.owner });
  }

  storeWillDestroy(store) {
    this.manager.removeStore(store);
  }

  destroy() {
    this.manager.destroy();
  }

}

const InternalMixin = makeInternalMixin(StoresInternal);

export default EmberObject.extend(InternalMixin, {

  store(identifier, opts) {
    return this._internal.manager.createStore(identifier, opts);
  },

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  }

});
