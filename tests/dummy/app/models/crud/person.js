import Persisted from './persisted';
import { attr } from 'ember-cli-zug/model/persisted/computed';

export default Persisted.extend({

  type: 'person',

  name:    attr(),
  email:   attr(),

});
