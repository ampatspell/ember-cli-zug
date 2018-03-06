import PersistedModel from 'models/model/persisted';
import { id, promise } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  save: promise('save'),

});
