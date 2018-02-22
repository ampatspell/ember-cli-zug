import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { query } from 'models/model/computed';

export default Component.extend({

  thing: computed(function() {
    return getOwner(this).factoryFor('config:environment').class.thing;
  }),

  query: query({
    context: 'store',
    id: 'all-people',
    query: db => db.collection('people').orderBy('__name__', 'asc')
  })

});
