import Component from '@ember/component';

export default Component.extend({

  actions: {
    save() {
      this.get('person').save();
    }
  }

});
