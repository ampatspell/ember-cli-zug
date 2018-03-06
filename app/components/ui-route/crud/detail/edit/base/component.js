import Component from '@ember/component';

export default Component.extend({

  actions: {
    save() {
      let { save, model } = this.getProperties('save', 'model');
      save && save(model);
    },
    cancel() {
      let { cancel, model } = this.getProperties('cancel', 'model');
      cancel && cancel(model);
    }
  }

});
