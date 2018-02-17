import EmberObject from '@ember/object';
import InternalDocument from '../model/internal-document';

export default EmberObject.extend({

  context: null,

  _createData(json) {
    return this.context._internal.data.createObject(json);
  },

  _createLocalReference() {

  },

  _createInternalDocument(data) {
    let context = this.get('context');
    return new InternalDocument(context, data);
  },

  createNewDocument(props={}) {
    let { id, collection, path, data: json } = props;
    let data = this._createData(json);
    let internal = this._createInternalDocument();
    return internal.model(true);
  }

});
