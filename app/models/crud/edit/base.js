import TransientModel from 'models/model/transient';
import { query, match } from 'models/model/computed';
import { readOnly } from '@ember/object/computed';
import { all } from 'rsvp';

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

  dirty: match({
    type: 'array',
    model: [ 'doc.isExisting', 'doc.isDirty' ],
    matches(model) {
      if(!model.get('doc.isExisting')) {
        return;
      }
      return model.get('doc.isDirty');
    }
  }),

  saveDirty() {
    return all(this.get('dirty').map(model => model.save()));
  },

  save() {
    let model = this.get('edit');
    return model.save().then(() => this.saveDirty());
  }

});
