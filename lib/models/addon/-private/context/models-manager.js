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

  modelClassForName(modelName) {
    let normalizedModelName = normalizeIdentifier(modelName);
    let factoryName = `model:${modelName}`;
    let factory = this.context.factoryFor(factoryName);
    assert(`model for name '${normalizedModelName}' is not registered`, !!factory);
    return factory;
  }

  modelTypeForClass(modelClass) {
    return get(modelClass, 'modelType');
  }

  modelClassAndTypeForName(modelName) {
    let modelClass = this.modelClassForName(modelName);
    let modelType = this.modelTypeForClass(modelClass.class);
    return { modelClass, modelType };
  }

  // { name, id, collection, path, data: { ... } }
  createNewInternalModel(opts) {
    let { name, id, collection, path, data } = opts;
    let { modelClass, modelType } = this.modelClassAndTypeForName(name);

    let context = this.context;

    let internal;
    if(modelType === 'persisted') {
      let document = context.documentsManager.createNewInternalDocument({ id, collection, path, data });
      internal = new InternalPersistedModel(context, modelClass, document);
      this.modelDocumentMapping.assign(document, internal);
    } else if (modelType === 'transient') {
      internal = new InternalTransientModel(context, modelClass, data);
    }

    context.identity.models.storeInternalModel(internal);

    return internal;
  }

  // { name, id, collection, path, create }
  existingInternalModel(opts) {
    let { name, id, collection, path, create } = opts;
    let context = this.context;

    path = pathFromOptions(opts);
    let internal = context.identity.models.existingInternalModel(path);

    if(internal) {
      if(name) {
        let expectedModelClass = this.modelClassForName(name);
        assert(`model is expected to be '${name}'`, expectedModelClass.class.detect(internal.modelClass.class));
      }
      return internal;
    }

    if(!name) {
      // TODO: if there is no name, infer model name from document
      return;
    }

    let { modelClass, modelType } = this.modelClassAndTypeForName(name);

    if(modelType !== 'persisted') {
      return;
    }

    let document = context.documentsManager.existingInternalDocument({ id, collection, path, create });

    if(!document) {
      return;
    }

    internal = new InternalPersistedModel(context, modelClass, document);
    this.modelDocumentMapping.assign(document, internal);
    context.identity.models.storeInternalModel(internal);

    return internal;
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
