import EmberObject from '@ember/object';
import { InternalMixin, modelprop } from '../model/internal';

export default EmberObject.extend(InternalMixin, {

  reference: modelprop()

});
