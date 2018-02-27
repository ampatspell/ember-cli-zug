import PersistedModel from 'models/model/persisted';
import { attr } from 'models/model/persisted/computed';

export default PersistedModel.extend({

  name: attr({ key: 'info.name' }),

});
