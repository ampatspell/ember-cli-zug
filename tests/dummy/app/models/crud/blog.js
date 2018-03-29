import Persisted from './persisted';
import { attr } from 'ember-cli-zug/model/persisted/computed';
import { match } from 'ember-cli-zug/model/computed';

export default Persisted.extend({

  type: 'blog',

  title: attr(),

  owner: match({
    type: 'single',
    owner: [ 'doc.data.owner' ],
    model: [ 'type', 'doc.isExisting', 'id' ],
    matches(model, owner) {
      if(!model.get('doc.isExisting')) {
        return;
      }
      if(model.get('type') !== 'person') {
        return;
      }
      return owner.get('doc.data.owner') === model.get('id');
    }
  }),

  setOwner(person) {
    let value = person ? person.get('id') : null;
    this.set('doc.data.owner', value);
  }

});
