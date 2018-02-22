import TransientModel from 'models/model/transient';
import { query } from 'models/model/computed';
import { readOnly } from '@ember/object/computed';

export default TransientModel.extend({

  id: null,

  query: query(function() {
    let id = this.get('id');
    return {
      id: `person-edit-${id}`,
      query: db => db.collection('people').where('__name__', '==', id)
    }
  }),

  person: readOnly('query.content.firstObject'),

  async load() {
    await this.get('query').load();
    return this;
  }

});
