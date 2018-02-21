import Internal from '../model/internal';
import { A } from '@ember/array';
import { all } from 'rsvp';
import { assert } from '@ember/debug';
import DataManager from './data-manager';
import DocumentsManager from './documents-manager';
import ModelsManager from './models-manager';
import TransactionManager from './transaction-manager';
import QueriesManager from './queries-manager';
import ModelsIdentity from './models-identity';
import DocumentsIdentity from './documents-identity';
import Operations from './operations';

export default class InternalContext extends Internal {

  constructor(stores, identifier) {
    super();

    this.stores = stores;
    this.identifier = identifier;

    this.firebase = null;
    this.firestore = null;
    this.ready = null;

    this.contexts = A();

    this.dataManager = new DataManager(this);
    this.documentsManager = new DocumentsManager(this);
    this.modelsManager = new ModelsManager(this);
    this.transactionManager = new TransactionManager(this);
    this.queriesManager = new QueriesManager(this);
    this.operations = new Operations();
    this.identity = {
      models: new ModelsIdentity(this),
      documents: new DocumentsIdentity(this)
    };
  }

  factoryFor(name) {
    return this.stores.factoryFor(name);
  }

  createModel() {
    return this.factoryFor('models:context').create({ _internal: this });
  }

  fork(identifier) {
    let internal = this.stores.createInternalNestedContext(this, identifier);
    this.contexts.pushObject(internal);
    return internal;
  }

  query(opts) {
    return this.queriesManager.createInternalQuery(opts);
  }

  // { name, id, collection, path, data: { ... } }
  build(opts) {
    return this.modelsManager.createNewInternalModel(opts);
  }

  // { name, id, collection, path, create }
  existing(opts) {
    return this.modelsManager.existingInternalModel(opts);
  }

  settle() {
    return all([
      this.operations.settle(),
      ...this.contexts.map(context => context.settle())
    ]);
  }

  modelNameForDocument(document) {
    let documentModel = document.model(true);
    let contextModel = this.model(true);
    let modelName = this.opts.modelNameForDocument(documentModel, contextModel);
    assert(
      `opts.modelNameForDocument for '${documentModel.get('path')}' in ${contextModel.get('absoluteIdentifier')} must return a model name`,
      typeof modelName === 'string' && modelName.trim().length
    );
    return modelName;
  }

  localInternalDocumentDidSave(internal) {
    this.modelsManager.localInternalDocumentDidSave(internal);
  }

  internalDocumentWillDestroy(internal) {
    this.modelsManager.internalDocumentWillDestroy(internal);
  }

  nestedContextWillDestroy(internal) {
    this.contexts.removeObject(internal);
  }

  willDestroy() {
    this.contexts.map(context => context.destroy());
    this.queriesManager.destroy();
    this.identity.models.destroy();
    this.identity.documents.destroy();
    super.willDestroy();
  }

}