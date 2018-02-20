import EmberObject from '@ember/object';
import { InternalMixin } from './model/internal';
import InternalStores from './internal-stores';

export default EmberObject.extend(InternalMixin, {

  init() {
    this._super(...arguments);
    this._internal = new InternalStores(this);
  },

  createContext(identifier, opts) {
    return this._internal.createInternalRootContext(identifier, opts).model(true);
  }

});
