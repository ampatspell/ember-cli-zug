import Component from '../base/component';
import { fork, transient } from 'models/model/computed';

export default Component.extend({

  componentNamePrefix: 'edit',

  context: fork({
    context: 'selection.context',
    name: 'edit'
  }),

  model: transient(function() {
    let model = this.get('selection');
    let { type } = model.getProperties('type');
    return {
      props: { name: `crud/edit/${type}`, data: { pristine: model } }
    };
  }),

  actions: {
    save() {
      this.get('model').save();
      let done = this.get('done');
      done && done();
    }
  },

});
