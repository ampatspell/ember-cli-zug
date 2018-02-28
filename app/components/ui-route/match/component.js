import Component from '@ember/component';
import { query, match } from 'models/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-match' ],

  context: null,

  query: query({
    id: 'all-people',
    type: 'array',
    query: db => db.collection('people')
  }),

  name: 'zeeba',

  first: match({
    type: 'single',
    owner: [ 'name' ],
    model: [ 'name' ],
    matches(model, owner) {
      return model.get('name') === owner.get('name');
    }
  }),

  includes: match({
    type: 'array',
    owner: [ 'name' ],
    model: [ 'name' ],
    matches(model, owner) {
      return model.get('name').includes(owner.get('name'));
    }
  })

});
