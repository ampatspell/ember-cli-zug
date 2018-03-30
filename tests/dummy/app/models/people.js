import TransientModel from 'ember-cli-zug/model/transient';
import { query } from 'ember-cli-zug/model/computed';

export default TransientModel.extend({

  query: query({
    id: 'people-by-name',
    type: 'array',
    query: db => db.collection('people').orderBy('name', 'asc')
  })

});
