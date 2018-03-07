import TransientModel from 'models/model/transient';
import { transient } from 'models/model/computed';

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

  save(model) {
    this.set('isEditing', false);
    model.save();
  },

  cancel() {
    this.set('isEditing', false);
  }

});
