import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  arrayFromArray: query({
    id: 'array-from-array',
    type: 'array',
    query: db => db.collection('people').orderBy('name', 'asc')
  }),

  arrayFromSingle: query({
    id: 'array-from-single',
    type: 'array',
    query: db => db.doc('people/ampatspell')
  })

});
