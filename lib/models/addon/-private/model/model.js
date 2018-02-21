import EmberObject from '@ember/object';
import { InternalMixin, modelprop } from './internal';

export default EmberObject.extend(InternalMixin, {

  context: modelprop('context')

}).reopenClass({

  modelNmae: null,
  modelType: null

});
