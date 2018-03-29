import Model from './model';
import { prop } from './internal';

export default Model.extend({

  path: prop('immutablePath')

}).reopenClass({

  modelType: 'transient'

});
