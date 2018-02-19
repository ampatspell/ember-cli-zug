import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import InternalModel from '../model/internal-model';
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

  _createInternalModel(modelName) {
    let modelClass = this._modelClassForName(modelName);
    let context = this.get('context');
    let internal = new InternalModel(context, modelClass);
    let identity = context._internal.identity.models;
    identity.storeInternalModel(internal);
    return internal;
  },

  createModel(modelName) {
    let internal = this._createInternalModel(modelName);
    return internal.model(true);
  },

  _internalModelWillDestroy(internal) {
    let identity = this.context._internal.identity.models;
    identity.removeInternalModel(internal);
  }

});
