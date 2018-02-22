import PersistedModel from 'models/model/persisted';
import { id, collection, path } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  id:         id(),
  collection: collection(),
  path:       path(),

});
