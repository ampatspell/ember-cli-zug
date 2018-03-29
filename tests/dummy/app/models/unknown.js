import PersistedModel from 'ember-cli-zug/model/persisted';
import { id, collection, path } from 'ember-cli-zug/model/persisted/computed';

export default PersistedModel.extend({

  id:         id(),
  collection: collection(),
  path:       path(),

});
