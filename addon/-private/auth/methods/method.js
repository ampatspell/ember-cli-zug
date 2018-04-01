import EmberObject from '@ember/object';
import { InternalMixin, prop, modelpromise } from '../../model/internal';

export {
  modelpromise
};

export default EmberObject.extend(InternalMixin, {

  type: prop(),

});
