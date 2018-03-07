import Component from '@ember/component';

export default Component.extend({

  actions: {
    save() {
      let { save, model } = this.getProperties('save', 'model');
      save && save(model);
    },
    done() {
      let done = this.get('done');
      done && done();
    }
  }

});
