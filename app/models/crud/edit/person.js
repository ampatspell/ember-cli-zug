import Base from './base';
import { query } from 'models/model/computed';

export default Base.extend({

  blogs: query({
    type: 'array',
    query: db => db.collection('blogs').orderBy('title')
  })

});
