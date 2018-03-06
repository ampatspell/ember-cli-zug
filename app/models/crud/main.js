import TransientModel from 'models/model/transient';
import { transient } from 'models/model/computed';

const collection = name => transient({
  create() {
    return { name: `crud/${name}`, path: `crud/collection/${name}` };
  }
});

export default TransientModel.extend({

  people: collection('people'),
  blogs: collection('blogs'),

  selection: null,

});
