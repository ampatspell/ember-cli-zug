import TransientModel from 'ember-cli-zug/model/transient';
import { transient } from 'ember-cli-zug/model/computed';

const collection = name => transient({
  props: { name: `crud/${name}`, path: `crud/collection/${name}` }
});

export default TransientModel.extend({

  people: collection('people'),
  blogs: collection('blogs'),

  selection: null,
  isEditing: false,

  select(selection) {
    this.setProperties({ isEditing: false, selection });
  },

  edit(selection) {
    this.setProperties({ isEditing: true, selection });
  },

  done() {
    this.set('isEditing', false);
  }

});
