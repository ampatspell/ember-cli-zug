import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { query } from 'models/model/computed';

export default Component.extend({

  thing: computed(function() {
    return getOwner(this).factoryFor('config:environment').class.thing;
  }),

  orderOptions:      [ '__name__', 'name', 'email', 'message' ],
  collectionOptions: [ 'blogs', 'people', 'posts' ],

  collection: 'people',
  order:      'name',

  query: query(function() {
    let { collection, order } = this.getProperties('collection', 'order');
    return {
      owner: [ 'collection', 'order' ],
      context: 'store',
      id: `all-${collection}-by-${order}`,
      query: db => db.collection(collection).orderBy(order, 'asc')
    };
  })

});
