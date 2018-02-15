import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export const InternalMixin = Mixin.create({

  _internal: null,

  willDestroy() {
    this._internal.modelWillDestroy(this);
    this._super(...arguments);
  }

});

export const invoke = (name, fn) => function() {
  let internal = this._internal;
  let result = internal[name].call(internal, ...arguments);
  if(fn) {
    result = fn.call(this, result);
  }
  return result;
};

export const promise = name => invoke(name, function(promise) {
  return promise.then(() => this);
});

export const prop = name => computed(function() {
  return this._internal[name];
});

export default class Internal {

  constructor(context) {
    this.context = context;
    this._model = null;
    this.isDestroyed = false;
  }

  factoryFor(name) {
    return this.context._internal.factoryFor(name);
  }

  model(create) {
    let model = this._model;
    if(!model && create && !this.isDestroyed) {
      model = this.createModel();
      this._model = model;
    }
    return model;
  }

  modelWillDestroy() {
    this.destroy();
  }

  willDestroy() {
    let model = this.model(false);
    if(model) {
      model.destroy();
      this._model = null;
    }
  }

  destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this.willDestroy();
  }

}
