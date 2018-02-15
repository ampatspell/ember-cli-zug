import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';

export default Mixin.create({

  destroyQuery: on('deactivate', function() {
    let model = this.currentModel;
    if(!model.get('isQuery')) {
      return;
    }
    return model.destroy();
  }),

});
