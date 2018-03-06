import PersistedModel from 'models/model/persisted';
import { id, attr } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  title: attr()

});
