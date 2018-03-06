import TransientModel from 'models/model/transient';
import { query, match } from 'models/model/computed';

export default TransientModel.extend({

  collection: null,
  order: null,
  model: null,

  query: query(function() {
    let { collection, order } = this.getProperties('collection', 'order');
    return {
      id: 'crud-collection-${collection}-by-${order}',
      type: 'array',
      query: db => db.collection(collection).orderBy(order, 'asc')
    };
  }),

  models: match({
    type: 'array',
    owner: [ 'type' ],
    model: [ 'type', 'doc.isExisting' ],
    matches(model, owner) {
      if(!model.get('doc.isExisting')) {
        return;
      }
      return model.get('type') === owner.get('type');
    }
  }),

});
