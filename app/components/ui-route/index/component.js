import Component from '@ember/component';
import { query } from 'models/model/computed';

export default Component.extend({

  query: query({
    context: 'store',
    id: 'all-people',
    query: db => db.collection('people').orderBy('__name__', 'asc')
  }),

  didInsertElement() {
    this._super();
    this.get('query').load();
  }

});
