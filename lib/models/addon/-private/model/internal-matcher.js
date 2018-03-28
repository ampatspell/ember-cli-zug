import Internal from './internal';

const normalize = opts => {
  opts.model = opts.model || [];
  return opts;
}

export default class InternalMatcher extends Internal {

  constructor(context, opts) {
    super();
    this.context = context;
    this.opts = normalize(opts);
    this.started = false;
    this._start();
  }

  createModel() {
    return this.context.factoryFor('models:matcher').create({ _internal: this });
  }

  get identity() {
    return this.context.identity.models;
  }

  get models() {
    return this.identity.storage.all;
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

  startObservingInternalModels(array) {
    array.map(internal => this.startObservingModel(internal.model(true)));
  }

  stopObservingInternalModels(array) {
    array.map(internal => this.stopObservingModel(internal.model(true)));
  }

  identityDidAddInternalModel(internal) {
    this.startObservingModel(internal.model(true));
  }

  identityDidRemoveInternalModel(internal) {
    this.stopObservingModel(internal.model(true));
  }

  //

  get identityObserver() {
    let observer = this._identityObserver;
    if(!observer) {
      observer = {
        added:   internal => this.identityDidAddInternalModel(internal),
        removed: internal => this.identityDidRemoveInternalModel(internal)
      };
      this._identityObserver = observer;
    }
    return observer;
  }

  startObservingIdentity() {
    this.identity.addObserver(this.identityObserver);
    this.startObservingInternalModels(this.models);
  }

  stopObservingIdentity() {
    this.identity.removeObserver(this.identityObserver);
    this.stopObservingInternalModels(this.models);
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
    this.context.matchersManager.removeInternalMatcher(this);
    super.willDestroy();
  }

}
