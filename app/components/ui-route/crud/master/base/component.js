import Component from '@ember/component';
import { query, match } from 'models/model/computed';

export default Component.extend({

  context: null,

  collection: null,
  order: null,
  modelName: null,

  query: query(function() {
    let { collection, order } = this.getProperties('collection', 'order');
    return {
      type: 'array',
      owner: [ 'collection', 'order' ],
      id: `crud-master-${collection}-by-${order}`,
      query: db => db.collection(collection).orderBy(order, 'asc')
    };
  }),

  models: match({
    type: 'array',
    owner: [ 'modelName' ],
    model: [ 'modelName', 'doc.isExisting' ],
    matches(model, owner) {
      if(!model.get('doc.isExisting')) {
        return;
      }
      return model.get('modelName') === owner.get('modelName');
    }
  }),

  actions: {
    select(model) {
      let select = this.get('select');
      select && select(model);
    }
  }

});
