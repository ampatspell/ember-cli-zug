import Component from '@ember/component';

export default Component.extend({

  actions: {
    edit() {
      let { edit, model } = this.getProperties('edit', 'model');
      edit && edit(model);
    }
  }

});
