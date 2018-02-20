import EmberObject, { get } from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import InternalPersistedModel from '../model/internal-persisted-model';
import InternalTransientModel from '../model/internal-transient-model';
import normalizeIdentifier from '../util/normalize-identifier';

export default EmberObject.extend({

  context: null,

  _modelClassForName(modelName) {
    let normalizedModelName = normalizeIdentifier(modelName);
    let factoryName = `model:${modelName}`;
    let factory = getOwner(this).factoryFor(factoryName);
    assert(`model for name '${normalizedModelName}' is not registered`, !!factory);
    return factory;
  },

  _modelTypeForClass(modelClass) {
    return get(modelClass, 'modelType');
  },

  _modelClassAndTypeForName(modelName) {
    let modelClass = this._modelClassForName(modelName);
    let modelType = this._modelTypeForClass(modelClass.class);
    return { modelClass, modelType };
  },

  _createInternalModel(modelName) {
    let { modelClass, modelType } = this._modelClassAndTypeForName(modelName);
    let context = this.get('context');

    let internal;
    if(modelType === 'persisted') {
      let doc = context._internal.documents.createNewDocument();
      internal = new InternalPersistedModel(context, modelClass, doc);
    } else if(modelType === 'transient') {
      internal = new InternalTransientModel(context, modelClass);
    }

    let identity = context._internal.identity.models;
    identity.storeInternalModel(internal);
    return internal;
  },

  createModel(modelName) {
    let internal = this._createInternalModel(modelName);
    return internal.model(true);
  },

  modelForDocument(document) {
    console.log(document.get('serialized'));
  },

  _internalModelWillDestroy(internal) {
    let identity = this.context._internal.identity.models;
    identity.removeInternalModel(internal);
  }

});
