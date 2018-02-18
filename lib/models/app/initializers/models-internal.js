import Stores from 'models/-private/stores';
import Store from 'models/-private/context/store';
import Context from 'models/-private/context/context';
import StoresManager from 'models/-private/context/stores-manager';
import ContextsManager from 'models/-private/context/contexts-manager';
import QueriesManager from 'models/-private/context/queries-manager';
import DocumentsManager from 'models/-private/context/documents-manager';
import DataManager from 'models/-private/context/data-manager';
import DocumentsIdentity from 'models/-private/context/documents-identity';
import Query from 'models/-private/model/query';
import Document from 'models/-private/model/document';
import DataObject from 'models/-private/model/data/object';
import DataArray from 'models/-private/model/data/array';

export default {
  name: 'models:internal',
  initialize(container) {
    container.register('models:stores', Stores);
    container.register('models:store', Store);
    container.register('models:context', Context);

    container.register('models:stores-manager', StoresManager);
    container.register('models:contexts-manager', ContextsManager);
    container.register('models:queries-manager', QueriesManager);
    container.register('models:documents-manager', DocumentsManager);
    container.register('models:data-manager', DataManager);
    container.register('models:documents-identity', DocumentsIdentity);

    container.register('models:query', Query);
    container.register('models:document', Document);
    container.register('models:data/object', DataObject);
    container.register('models:data/array', DataArray);
  }
}
