import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { query } from 'models/model/computed';

export default Component.extend({

  thing: computed(function() {
    return getOwner(this).factoryFor('config:environment').class.thing;
  }),

  collection: 'people',
  order: '__name__',

  query: query(function() {
    let { collection, order } = this.getProperties('collection', 'order');
    return {
      owner: [ 'collection', 'order' ],
      context: 'store',
      id: 'all-people',
      query: db => {
        console.log(`db.collection(${collection}).orderBy(${order})`);
        return db.collection(collection).orderBy(order, 'asc');
      }
    };
  })

});
