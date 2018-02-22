import { assign } from '@ember/polyfills';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import Context from '../context/context';
import Destroyable from '../model/destroyable';
import _destroyable from '../util/destroyable-computed';

export class Property extends Destroyable {

  constructor(owner, key, fn) {
    super();
    this.owner = owner;
    this.key = key;
    this.fn = fn;
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

  internalModel(create) {
    let internal = this._internal;
    if(!internal && create) {
      internal = this.createInternalModel();
      this._internal = internal;
    }
    return internal;
  }

  model(create) {
    let internal = this.internalModel(create);
    if(!internal) {
      return;
    }
    return internal.model(true);
  }

  willDestroy() {
    let internal = this._internal;
    internal && internal.destroy();
    super.willDestroy();
  }

}

const asFunction = arg => {
  if(typeof arg === 'function') {
    return arg;
  }
  return () => arg;
}

export const property = Property => {
  return opts => {
    let fn = asFunction(opts);
    return _destroyable({
      create(key) {
        return new Property(this, key, fn);
      },
      get(internal) {
        return internal.model(true);
      },
      destroy(internal) {
        internal.destroy();
      }
    });
  };
};
