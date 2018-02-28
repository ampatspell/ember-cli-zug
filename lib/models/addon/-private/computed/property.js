import { assign } from '@ember/polyfills';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import Context from '../context/context';
import Destroyable from '../model/destroyable';
import ObjectObserver from '../model/object-observer';

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

  get isReusable() {
    return true;
  }

  notifyPropertyChange() {
    this.owner.notifyPropertyChange(this.key);
  }

  //

  normalizeOpts(opts) {
    return opts;
  }

  get opts() {
    let opts = this._opts;
    if(!opts) {
      opts = this.normalizeOpts(assign({ context: 'context' }, this.fn.call(this.owner, this.key)));
      this._opts = opts;
    }
    return opts;
  }

  get context() {
    let context = this._context;
    if(!context) {
      let opts = this.opts;
      assert(`context property is required`, opts.context);
      let model = get(this.owner, opts.context);
      assert(`'${opts.context}' must be Context instance in ${this.owner} not ${model}`, Context.detectInstance(model));
      context = model._internal;
      this._context = context;
    }
    return context;
  }

  //

  didCreateInternalModel() {
    this.startOwnerObserver();
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

  //

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

  //

  get ownerObservationKeys() {
    return this.opts.owner;
  }

  ownerObserverValueForKeyDidChange() {
    this.reset();
  }

  ownerObserver(create) {
    let observer = this._ownerObserver;
    if(!observer && create) {
      let keys = this.ownerObservationKeys;
      if(!keys || keys.length === 0) {
        return;
      }
      observer = new ObjectObserver(this.owner, keys, {
        onChange: key => this.ownerObserverValueForKeyDidChange(key)
      });
      this._ownerObserver = observer;
    }
    return observer;
  }

  startOwnerObserver() {
    let observer = this.ownerObserver(true);
    if(observer) {
      observer.start();
    }
  }

  //

  willReset() {
  }

  reset(notify=true) {
    let internal = this._internal;

    this.willReset();

    let observer = this._ownerObserver;
    if(observer) {
      observer.destroy();
      this._ownerObserver = null;
    }

    if(internal) {
      internal.destroy();
      this._internal = null;
    }

    this._context = null;
    this._opts = null;

    if(notify) {
      this.notifyPropertyChange();
    }
  }

  willDestroy() {
    this.reset(false);
    super.willDestroy();
  }

}
