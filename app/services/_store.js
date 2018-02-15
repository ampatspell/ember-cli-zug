import { getOwner } from '@ember/application';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Service.extend({

  firebase: service(),

  queries: computed(function() {
    return A();
  }),

  modelClassForDocument(doc) {
    return getOwner(this).factoryFor('model:post');
  },

  _createDocument(snapshot) {
    let doc = getOwner(this).factoryFor('model:firestore/document').create({ store: this });
    doc.update(snapshot);
    return doc;
  },

  _createModel(doc) {
    let modelClass = this.modelClassForDocument(doc);
    return modelClass.create({ doc });
  },

  _saveDocument(doc) {
    let firestore = this.get('firebase').firestore();
    let { path, data } = doc.getProperties('path', 'data');
    let ref = firestore.doc(path);
    return ref.set(data).then(() => doc);
  },

  // id, type, query
  query(opts) {
    let query = getOwner(this).factoryFor('model:firestore/query').create({ store: this, opts });
    this.get('queries').pushObject(query);
    console.log('add', query+'');
    return query;
  },

  _queryWillDestroy(query) {
    console.log('remove', query+'');
    this.get('queries').removeObject(query);
  }

});
