import Model from './model';
import { modelprop } from './internal';

export default Model.extend({

  doc: modelprop('doc')

}).reopenClass({

  modelType: 'persisted'

});
