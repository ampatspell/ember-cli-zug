import Destroyable from './destroyable';

const normalize = opts => {
  opts.model = opts.model || [];
  return opts;
}

export default class InternalMatcher extends Destroyable {

  constructor(context, opts) {
    super();
    this.context = context;
    this.opts = normalize(opts);
    this.started = false;
    this._start();
  }

  get identity() {
    return this.context.identity.models.model(true);
  }

  get matcher() {
    let matcher = this._matcher;
    if(!matcher) {
      let fn = this.opts.matches;
      matcher = model => !!fn(model);
      this._matcher = matcher;
    }
    return matcher;
  }

  matches(model) {
    return this.matcher(model);
  }

  //

  withModelKeys(cb) {
    let keys = this.opts.model;
    keys.map(key => cb(key));
  }

  startObservingModel(model) {
    this.withModelKeys(key => model.addObserver(key, this, this.modelKeyDidChange));
    if(this.started) {
      this.didAddModel(model);
    }
  }

  stopObservingModel(model) {
    this.withModelKeys(key => model.removeObserver(key, this, this.modelKeyDidChange));
    if(this.started) {
      this.didRemoveModel(model);
    }
  }

  startObservingModels(array) {
    array.forEach(model => this.startObservingModel(model));
  }

  stopObservingModels(array) {
    array.forEach(model => this.stopObservingModel(model));
  }

  //

  identityContentWillChange(array, start, removeCount) {
    if(!removeCount) {
      return;
    }
    let removing = array.slice(start, start + removeCount);
    this.stopObservingModels(removing);
  }

  identityContentDidChange(array, start, removeCount, addCount) {
    if(!addCount) {
      return;
    }
    let adding = array.slice(start, start + addCount);
    this.startObservingModels(adding);
  }

  get identityObserverOptions() {
    return {
      willChange: this.identityContentWillChange,
      didChange: this.identityContentDidChange
    };
  }

  startObservingIdentity() {
    let identity = this.identity;
    identity.addArrayObserver(this, this.identityObserverOptions);
    this.startObservingModels(identity);
  }

  stopObservingIdentity() {
    let identity = this.identity;
    identity.removeArrayObserver(this, this.identityObserverOptions);
    this.stopObservingModels(identity);
  }

  //

  _start() {
    this.startObservingIdentity();
    this.start();
    this.started = true;
  }

  _stop() {
    this.started = false;
    this.stop();
    this.stopObservingIdentity();
  }

  willDestroy() {
    this._stop();
    super.willDestroy();
  }

}
