import { assign } from '@ember/polyfills';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import Context from '../context/context';
import Destroyable from '../model/destroyable';

const asFunction = arg => {
  if(typeof arg === 'function') {
    return arg;
  }
  return () => arg;
}

export default class Property extends Destroyable {

  constructor(owner, key, opts) {
    super();
    this.owner = owner;
    this.key = key;
    this.fn = asFunction(opts);
  }

  reusable() {
    return false;
  }

  get opts() {
    let opts = this._opts;
    if(!opts) {
      opts = assign({ context: 'context' }, this.fn.call(this.owner, this.key));
      this._opts = opts;
    }
    return opts;
  }

  get context() {
    let context = this._context;
    if(!context) {
      let opts = this.opts;
      assert(`context property is required`, opts.context);
      context = get(this.owner, opts.context);
      assert(`'${opts.context}' must be Context instance in ${this.owner} not ${context}`, Context.detectInstance(context));
      this._context = context;
    }
    return context;
  }

  didCreateInternalModel() {
  }

  internalModel(create) {
    let internal = this._internal;
    if(!internal && create) {
      internal = this.createInternalModel();
      this._internal = internal;
      this.didCreateInternalModel();
    }
    return internal;
  }

  willCreateModel() {
  }

  model(create) {
    let internal = this.internalModel(create);
    if(!internal) {
      return;
    }
    let model = internal.model(false);
    if(!model) {
      this.willCreateModel(internal);
      model = internal.model(true);
    }
    return model;
  }

  getValue() {
    return this.model(true);
  }

  willReset() {
  }

  reset(notify=true) {
    let { _internal, owner, key } = this;

    this.willReset();

    _internal && _internal.destroy();

    this._internal = null;
    this._context = null;
    this._opts = null;

    if(notify) {
      owner.notifyPropertyChange(key);
    }
  }

  willDestroy() {
    this.reset(false);
    super.willDestroy();
  }

}
