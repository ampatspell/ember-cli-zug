import { get } from '@ember/object';
import { assert } from '@ember/debug';
import normalizeIdentifier from '../util/normalize-identifier';
import pathFromOptions from '../util/path-from-options';
import Destroyable from '../model/destroyable';
import InternalTransientModel from '../model/internal-transient-model';
import InternalPersistedModel from '../model/internal-persisted-model';

export default class ModelsManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
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
      let doc = context.documentsManager.createNewInternalDocument({ id, collection, path, data });
      internal = new InternalPersistedModel(context, modelClass, doc);
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
      // TODO: validate modelClass
      return internal;
    }

    if(!create) {
      return;
    }

    // TODO: this part might be based on document.publicModel getter

    let { modelClass, modelType } = this.modelClassAndTypeForName(name);
    if(modelType === 'persisted') {
      // TODO: doc might exist
      let doc = context.documentsManager.createExistingInternalDocument({ id, collection, path });
      internal = new InternalPersistedModel(context, modelClass, doc);
    } else if(modelType === 'transient') {
      internal = new InternalTransientModel(context, modelClass, path);
    }

    context.identity.models.storeInternalModel(internal);

    return internal;
  }

  internalModelWillDestroy(internal) {
    this.context.identity.models.removeInternalModel(internal);
  }

}
