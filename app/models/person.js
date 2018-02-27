import PersistedModel from 'models/model/persisted';
import { id, attr, promise } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  name:    attr(),
  email:   attr(),
  version: attr(),

  save: promise('save')

});
