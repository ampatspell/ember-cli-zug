import TransientModel from 'ember-cli-zug/model/transient';
import { query } from 'ember-cli-zug/model/computed';
import { readOnly } from '@ember/object/computed';

export default TransientModel.extend({

  id: null,

  query: query(function() {
    let id = this.get('id');
    return {
      id: `person-edit-${id}`,
      type: 'single',
      query: db => db.collection('people').where('__name__', '==', id)
    }
  }),

  person: readOnly('query.content'),

  async load() {
    await this.get('query').load();
    return this;
  }

});
