import Base from './base';
import { query } from 'ember-cli-zug/model/computed';

export default Base.extend({

  blogs: query({
    type: 'array',
    query: db => db.collection('blogs').orderBy('title')
  })

});
