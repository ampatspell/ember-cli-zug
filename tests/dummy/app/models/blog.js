import PersistedModel from 'ember-cli-zug/model/persisted';
import { id, attr } from 'ember-cli-zug/model/persisted/computed';

export default PersistedModel.extend({

  id: id(),

  title: attr()

});
