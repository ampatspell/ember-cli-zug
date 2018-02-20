import PersistedModel from 'models/model/persisted';
import { id, attr, promise } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  name: attr('name'),
  email: attr('email'),
  version: attr('version'),

  save: promise('save')

});
