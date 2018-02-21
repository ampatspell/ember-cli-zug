import TransientModel from 'models/model/transient';
import { computed } from '@ember/object';

export default TransientModel.extend({

  // query: query({
  //   id: 'people-by-name',
  //   query: db => db.collection('people').orderBy('name')
  // }),

  query: computed(function() {
    return this.get('context').query({ id: 'people-by-name', query: db => db.collection('people').orderBy('name', 'asc') });
  }),

});
