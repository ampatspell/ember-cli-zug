import EmberObject from '@ember/object';
import { InternalMixin, prop } from '../model/internal';

export default EmberObject.extend(InternalMixin, {

  available: prop('types'),

  unknownProperty(key) {
    let method = this._internal.method(key);
    return method && method.model(true);
  }

});
