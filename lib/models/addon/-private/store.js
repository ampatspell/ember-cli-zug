import { createContext, BaseContextInternal } from './base-context';

class StoreInternal extends BaseContextInternal {

  constructor(owner) {
    super(owner);
    this.firebase = firebase.initializeApp(this.owner.opts, this.owner.identifier);
  }

  destroy() {
    this.owner.stores._internal.storeWillDestroy(this.owner);
    super.destroy();
  }

}

export default createContext(StoreInternal);
