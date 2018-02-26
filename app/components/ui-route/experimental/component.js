import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { query } from 'models/model/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  store: service(),

  arrayFromArray: query({
    id: 'array-from-array',
    type: 'array',
    context: 'store',
    query: db => db.collection('people').orderBy('name', 'asc')
  }),

  arrayFromSingle: query({
    id: 'array-from-single',
    type: 'array',
    context: 'store',
    query: db => db.doc('people/ampatspell')
  })

});
