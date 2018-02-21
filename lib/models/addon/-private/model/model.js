import EmberObject from '@ember/object';
import { InternalMixin, prop } from './internal';

export default EmberObject.extend(InternalMixin, {

  context: prop('context')

}).reopenClass({

  modelNmae: null,
  modelType: null

});
