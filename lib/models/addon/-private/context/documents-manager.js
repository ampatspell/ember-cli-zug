import EmberObject from '@ember/object';
import InternalDocument from '../model/internal-document';
import LocalReference from '../model/reference/local-reference';

export default EmberObject.extend({

  context: null,

  _createData(json) {
    return this.context._internal.data.createObject(json);
  },

  _createLocalReference(id, collection, path) {
    return new LocalReference(id, collection, path);
  },

  _createInternalDocument(reference, data) {
    let context = this.get('context');
    return new InternalDocument(context, reference, data);
  },

  createNewDocument(props={}) {
    let { id, collection, path, data: data_ } = props;
    let data = this._createData(data_);
    let reference = this._createLocalReference(id, collection, path);
    let internal = this._createInternalDocument(reference, data);
    return internal.model(true);
  }

});
