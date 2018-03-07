import Component from '../base/component';
import { fork, transient } from 'models/model/computed';

export default Component.extend({

  componentNamePrefix: 'edit',

  context: fork({
    context: 'model.context',
    name: 'edit'
  }),

  edit: transient(function() {
    let model = this.get('model');
    let { type } = model.getProperties('type');
    return {
      props: { name: `crud/edit/${type}`, data: { pristine: model } }
    };
  }),

  actions: {
    save() {
      this.get('edit').save();
      let done = this.get('done');
      done && done();
    }
  },

});
