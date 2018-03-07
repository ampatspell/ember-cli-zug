import TransientModel from 'models/model/transient';
import { query } from 'models/model/computed';
import { readOnly } from '@ember/object/computed';

export default TransientModel.extend({

  pristine: null,

  query: query(function() {
    let path = this.get('pristine.doc.path');
    return {
      type: 'single',
      owner: [ 'pristine.path' ],
      query: db => db.doc(path)
    }
  }),

  edit: readOnly('query.content'),

  save() {
    let model = this.get('edit');
    return model.save();
  }

});
