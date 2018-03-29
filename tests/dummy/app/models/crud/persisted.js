import PersistedModel from 'ember-cli-zug/model/persisted';
import { id, promise } from 'ember-cli-zug/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  save: promise('save'),

});
