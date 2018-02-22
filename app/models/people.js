import TransientModel from 'models/model/transient';
import { query } from 'models/model/computed';

export default TransientModel.extend({

  query: query({
    id: 'people-by-name',
    query: db => db.collection('people').orderBy('name', 'asc')
  })

});
