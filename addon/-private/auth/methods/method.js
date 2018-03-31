import EmberObject from '@ember/object';
import { InternalMixin, prop } from '../../model/internal';

export default EmberObject.extend(InternalMixin, {

  type: prop(),

});
