import EmberObject from '@ember/object';
import InternalDocument from './internal-document';

export default EmberObject.extend({

  context: null,

  createInternalDocument(snapshot) {
    let context = this.get('context');
    return new InternalDocument(context, this, snapshot);
  },

  willDestroy() {
    this._super(...arguments);
  }

});
