import { get } from '@ember/object';
import { assert } from '@ember/debug';
import normalizeIdentifier from '../util/normalize-identifier';
import pathFromOptions from '../util/path-from-options';
import Destroyable from '../model/destroyable';
import InternalTransientModel from '../model/internal-transient-model';
import InternalPersistedModel from '../model/internal-persisted-model';
import ModelDocumentMapping from './model-document-mapping';

export default class ModelsManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.modelDocumentMapping = new ModelDocumentMapping();
  }

  _modelClassForName(normalizedName, optional) {
    let factoryName = `model:${normalizedName}`;
    let factory = this.context.factoryFor(factoryName);
    assert(`model for name '${normalizedName}' is not registered`, !!factory || optional);
    return factory;
  }

  _extendedModelClassForName(normalizedName) {
    let factoryName = `models:model/${normalizedName}`;
    let factory = this.context.factoryFor(factoryName);
    return { factory, factoryName };
  }

  modelClassForName(modelName) {
    let normalizedName = normalizeIdentifier(modelName, 'model name');
    let { factory, factoryName } = this._extendedModelClassForName(normalizedName);
    if(!factory) {
      factory = this._modelClassForName(normalizedName);
      factory = factory.class.reopenClass({ modelName: normalizedName });
      this.context.registerFactory(factoryName, factory);
      factory = this._extendedModelClassForName(normalizedName).factory;
    }
    return factory;
  }

  modelNameForClass(modelClass) {
    return get(modelClass, 'modelName');
  }

  modelTypeForClass(modelClass) {
    return get(modelClass, 'modelType');
  }

  modelClassAndTypeForName(modelName) {
    let modelClass = this.modelClassForName(modelName);
    let modelType = this.modelTypeForClass(modelClass.class);
    return { modelClass, modelType };
  }

  modelClassAndTypeForDocument(document) {
    let modelName = this.context.modelNameForDocument(document);
    return this.modelClassAndTypeForName(modelName);
  }

  createAndStoreInternalPersistedModelWithDocument(modelClass, document) {
    let context = this.context;
    let internal = new InternalPersistedModel(context, modelClass, document);
    this.modelDocumentMapping.assign(document, internal);
    context.identity.models.storeInternalModel(internal);
    return internal;
  }

  createAndStoreInternalTransientModel(modelClass, path, data) {
    let context = this.context;
    let internal = new InternalTransientModel(context, modelClass, path, data);
    context.identity.models.storeInternalModel(internal);
    return internal;
  }

  // { name, id, collection, path, data: { ... } }
  createNewInternalModel(opts={}) {
    let { name, id, collection, path, data } = opts;
    let { modelClass, modelType } = this.modelClassAndTypeForName(name);

    let internal;
    if(modelType === 'persisted') {
      let document = this.context.documentsManager.createNewInternalDocument({ id, collection, path, data });
      internal = this.createAndStoreInternalPersistedModelWithDocument(modelClass, document);
    } else if (modelType === 'transient') {
      path = pathFromOptions(opts);
      if(path) {
        internal = this.context.identity.models.existingInternalModel(path);
        assert(`transient model with path '${path}' is already registered`, !internal);
      }
      internal = this.createAndStoreInternalTransientModel(modelClass, path, data);
    }

    return internal;
  }

  internalModelForDocument(document) {
    assert(`document must have immutablePath`, document.immutablePath);

    let internal = this.modelDocumentMapping.modelForDocument(document);
    if(internal) {
      return internal;
    }

    let { modelClass, modelType } = this.modelClassAndTypeForDocument(document);
    assert(`model must be persisted`, modelType === 'persisted');

    return this.createAndStoreInternalPersistedModelWithDocument(modelClass, document);
  }

  // { name, id, collection, path, create }
  existingInternalModel(opts) {
    let { name, id, collection, path, data, create } = opts;

    if(!name) {
      // TODO: if there is no name, infer model name from document
      return;
    }

    path = pathFromOptions(opts);

    if(!path && !collection) {
      return;
    }

    let context = this.context;

    let internal;

    if(path) {
      internal = context.identity.models.existingInternalModel(path);
    }

    if(internal) {
      if(name) {
        let expectedModelClass = this.modelClassForName(name);
        assert(
          `model is expected to be '${name}' but is '${this.modelNameForClass(internal.modelClass.class)}'`,
          expectedModelClass.class.detect(internal.modelClass.class)
        );
      }
      return internal;
    }

    if(!create) {
      return;
    }

    let { modelClass, modelType } = this.modelClassAndTypeForName(name);

    if(modelType === 'transient') {
      internal = this.createAndStoreInternalTransientModel(modelClass, path, null);
    } else if(modelType === 'persisted') {
      let document;
      if(path) {
        document = context.documentsManager.existingInternalDocument({ id, collection, path, create });
        if(!document) {
          return;
        }
      } else {
        document = this.context.documentsManager.createAutogeneratedInternalDocument({ collection, data });
      }
      internal = this.createAndStoreInternalPersistedModelWithDocument(modelClass, document);
    }

    return internal;
  }

  hasModelClassForName(modelName) {
    let normalizedName = normalizeIdentifier(modelName, 'model name');
    return !!this._modelClassForName(normalizedName, true);
  }

  internalModelWillDestroy(internal) {
    this.context.identity.models.removeInternalModel(internal);
    this.modelDocumentMapping.unassign(internal);
  }

  localInternalDocumentDidSave(document) {
    let model = this.modelDocumentMapping.modelForDocument(document);
    if(model) {
      this.context.identity.models.storeInternalModel(model);
    }
  }

  internalDocumentWillDestroy(document) {
    let model = this.modelDocumentMapping.modelForDocument(document);
    if(model) {
      model.destroy();
    }
  }

}
