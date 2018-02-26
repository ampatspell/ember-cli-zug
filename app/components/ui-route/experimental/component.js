import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { query } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  arrayFromQuery: query({
    id: 'array-from-array',
    type: 'array',
    query: db => db.collection('people').orderBy('name', 'asc')
  }),

  arrayFromCollection: query({
    id: 'array-from-collection',
    type: 'array',
    query: db => db.collection('people')
  }),

  arrayFromDocument: query({
    id: 'array-from-document',
    type: 'array',
    query: db => db.doc('people/ampatspell')
  })

});
