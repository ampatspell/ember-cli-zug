import PersistedModel from 'ember-cli-zug/model/persisted';
import { id, attr, promise } from 'ember-cli-zug/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  createdAt: attr({ key: 'created_at' }),
  index: attr(),

  save: promise('save')

});
