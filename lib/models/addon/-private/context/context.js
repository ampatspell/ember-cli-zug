import { createContext, BaseContextInternal } from './base-context';

class ContextInternal extends BaseContextInternal {

  constructor(owner) {
    super(owner, owner.parent._internal);
    this.firebase  = owner.parent._internal.firebase;
  }

}

export default createContext(ContextInternal);
