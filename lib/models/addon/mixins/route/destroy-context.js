import Mixin from '@ember/object/mixin';

export default Mixin.create({

  deactivate() {
    this._super(...arguments);
    let context = this.get('currentModel.context');
    if(!context) {
      return;
    }
    context.destroy();
  }

});
