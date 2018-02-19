import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import Destroyable from './destroyable';
import withPropertyChanges from '../util/with-property-changes';

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

export const internal = fn => computed(function() {
  return fn.call(this, this._internal);
});

export const prop = name => internal(function(internal) {
  return internal[name];
});

export const mut = name => computed({
  get() {
    return this._internal[name];
  },
  set(key, value) {
    return this._internal[name] = value;
  }
});

export default class Internal extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this._model = null;
  }

  factoryFor(name) {
    return this.context._internal.factoryFor(name);
  }

  withPropertyChanges(notify, cb) {
    return withPropertyChanges(this, notify, cb);
  }

  didCreateModel() {
  }

  didDestroyModel() {
  }

  model(create) {
    let model = this._model;
    if(!model && create && !this.isDestroyed) {
      model = this.createModel();
      this._model = model;
      this.didCreateModel();
    }
    return model;
  }

  modelWillDestroy() {
    this.didDestroyModel();
    this.destroy();
  }

  willDestroy() {
    super.willDestroy();
    let model = this.model(false);
    if(model) {
      model.destroy();
      this._model = null;
    }
  }

}
