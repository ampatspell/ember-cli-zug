import { createContext, BaseContextInternal } from './base-context';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import initialize from  './firebase';

class StoreInternal extends BaseContextInternal {

  constructor(owner) {
    super(owner);
    this.ready = initialize(assign(this.owner.getProperties('identifier', 'opts'), {
      ready: app => this.firebase = app
    }));
  }

  destroy() {
    this.owner.stores._internal.storeWillDestroy(this.owner);
    super.destroy();
  }

}

export default createContext(StoreInternal).extend({

  ready: computed(function() {
    return this._internal.ready;
  }).readOnly()

});

