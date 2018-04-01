import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-experimental' ],

  actions: {
    update(file) {
      this.set('file', file);
    },
    upload() {
      let file = this.get('file');
      if(!file) {
        return;
      }
      window.storage.upload(file);
    }
  }

});
