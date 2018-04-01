import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import Destroyable from './destroyable';
import withPropertyChanges from '../util/with-property-changes';
import rm from '../util/array-remove';

export const propertiesMixin = (prop, keys) => Mixin.create(keys.reduce((hash, key) => {
  hash[key] = computed(function() {
    return this._internal[prop][key];
  }).readOnly();
  return hash;
}, {}));

export const serialized = keys => computed(...keys, function() {
  return this.getProperties(...keys);
}).readOnly();

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

export const promise = (name, fn) => invoke(name, function(promise) {
  return promise.then(arg => fn ? fn.call(this, arg) : this);
});

export const modelpromise = name => invoke(name, function(promise) {
  return promise.then(internal => internal && internal.model(true));
});

export const model = name => invoke(name, internal => internal && internal.model(true));

export const internal = fn => computed(function(key) {
  return fn.call(this, key, this._internal);
}).readOnly();

export const prop = (name, fn) => internal(function(key, internal) {
  let value = internal[name || key];
  if(fn) {
    value = fn.call(this, value);
  }
  return value;
});

export const modelprop = name => prop(name, internal => internal && internal.model(true));

export const mut = name => computed({
  get(key) {
    return this._internal[name || key];
  },
  set(key, value) {
    return this._internal[name || key] = value;
  }
});

export const state = () => computed(function(key) {
  return this._internal.state[key];
}).readOnly();

export default class Internal extends Destroyable {

  constructor() {
    super();
    this._model = null;
    this._onWillDestroy = [];
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
    this._onWillDestroy.forEach(fn => fn(this));
  }

  onWillDestroy(cb) {
    this._onWillDestroy.push(cb);
    return () => rm(this._onWillDestroy, cb);
  }

}
