import Persisted from './persisted';
import { attr } from 'models/model/persisted/computed';

export default Persisted.extend({

  type: 'blog',

  title: attr()

});
