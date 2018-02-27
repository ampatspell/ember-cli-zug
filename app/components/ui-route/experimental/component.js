import Component from '@ember/component';
import { query } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  arrayFromQuery: query({
    id: 'array-from-array',
    type: 'array',
    query: db => db.collection('people').orderBy('name', 'asc').limit(3)
  }),

  arrayFromCollection: query({
    id: 'array-from-collection',
    type: 'array',
    query: db => db.collection('people').limit(3)
  }),

  arrayFromDocument: query({
    id: 'array-from-document',
    type: 'array',
    query: db => db.doc('people/ampatspell')
  })

});
