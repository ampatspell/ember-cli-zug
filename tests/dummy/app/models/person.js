import PersistedModel from 'ember-cli-zug/model/persisted';
import { id, attr, promise } from 'ember-cli-zug/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  name:    attr(),
  email:   attr(),
  version: attr(),

  save: promise('save')

});
