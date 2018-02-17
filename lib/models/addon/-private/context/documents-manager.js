import EmberObject from '@ember/object';
import InternalDocument from '../model/internal-document';

export default EmberObject.extend({

  context: null,

  createInternalDocument() {
    let context = this.get('context');
    return new InternalDocument(context, this);
  },

  createDocument() {

  },

  willDestroy() {
    this._super(...arguments);
  }

});
