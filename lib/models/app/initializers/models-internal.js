import Stores from 'models/-private/stores';
import Context from 'models/-private/context/context';
import Identity from 'models/-private/model/identity';
import Query from 'models/-private/model/query';
import Document from 'models/-private/model/document';
import DataObject from 'models/-private/model/data/object';
import DataArray from 'models/-private/model/data/array';

export default {
  name: 'models:internal',
  initialize(container) {
    container.register('models:stores', Stores);
    container.register('models:context', Context);

    container.register('models:identity', Identity);
    container.register('models:query', Query);
    container.register('models:document', Document);
    container.register('models:data/object', DataObject);
    container.register('models:data/array', DataArray);
  }
}
