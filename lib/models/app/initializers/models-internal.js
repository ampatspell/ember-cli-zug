import Stores from 'models/-private/stores';
import Store from 'models/-private/context/store';
import Context from 'models/-private/context/context';
import StoresManager from 'models/-private/context/stores-manager';
import ContextsManager from 'models/-private/context/contexts-manager';
import QueriesManager from 'models/-private/context/queries-manager';
import DocumentsManager from 'models/-private/context/documents-manager';
import DataManager from 'models/-private/context/data-manager';
import TransactionManager from 'models/-private/context/transaction-manager';
import ModelsManager from 'models/-private/context/models-manager';
import DocumentsIdentity from 'models/-private/context/documents-identity';
import ModelsIdentity from 'models/-private/context/models-identity';
import Operations from 'models/-private/context/operations';
import Query from 'models/-private/model/query';
import Document from 'models/-private/model/document';
import DataObject from 'models/-private/model/data/object';
import DataArray from 'models/-private/model/data/array';
import Model from 'models/-private/model/model';

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
    container.register('models:models-manager', ModelsManager);
    container.register('models:transaction-manager', TransactionManager);
    container.register('models:documents-identity', DocumentsIdentity);
    container.register('models:models-identity', ModelsIdentity);
    container.register('models:operations', Operations);

    container.register('models:query', Query);
    container.register('models:document', Document);
    container.register('models:model', Model);
    container.register('models:data/object', DataObject);
    container.register('models:data/array', DataArray);
  }
}
