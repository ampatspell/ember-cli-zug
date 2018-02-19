import Model from './model';
import { prop } from './internal';

export default Model.extend({

  doc: prop('doc')

}).reopenClass({

  modelType: 'persisted'

});
