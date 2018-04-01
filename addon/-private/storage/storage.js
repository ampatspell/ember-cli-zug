import EmberObject from '@ember/object';
import { InternalMixin, model } from '../model/internal';

export default EmberObject.extend(InternalMixin, {

  ref: model('ref'),
  urlRef: model('refFromURL')

});
