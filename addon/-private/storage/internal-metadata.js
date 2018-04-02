import Internal from '../model/internal';
import { resolve, reject } from 'rsvp';
import { PromiseOperation } from '../model/operation';
import State from './metadata-state';

export default class InternalMetadata extends Internal {

  constructor(context, reference) {
    super();
    this.context = context;
    this.reference = reference;
    this.state = new State(this);
    this.metadata = undefined;
  }

  get storage() {
    return this.reference.storage;
  }

  createModel() {
    return this.context.factoryFor('zug:storage/metadata').create({ _internal: this });
  }

  get ref() {
    return this.reference.ref;
  }

  withState(cb) {
    this.withPropertyChanges(true, changed => cb(changed, this.state));
  }

  onLoading() {
    this.withState((changed, state) => {
      state.onLoading(changed);
    });
  }

  onLoaded(metadata) {
    this.withState((changed, state) => {
      this.raw = metadata;
      changed('raw');
      state.onLoaded(changed);
    });
    return this;
  }

  onMissing() {
    this.withState((changed, state) => {
      state.onMissing(changed);
    });
  }

  onError(err, opts) {
    let missing = err.code === 'storage/object-not-found';

    if(missing && opts.optional) {
      this.onMissing();
      return this;
    }

    this.withState((changed, state) => {
      if(missing) {
        state.onMissingError(err, changed);
      } else {
        state.onError(err, changed);
      }
    });

    return reject(err);
  }

  _load() {
    let operation = new PromiseOperation(resolve(this.ref.getMetadata()), { name: 'storage/metadata' });
    this.storage.registerOperation(operation);
    return operation.promise;
  }

  load(opts={}) {
    if(this.state.isLoaded && !opts.reload) {
      return resolve(this);
    }

    this.onLoading();
    return this._load().then(metadata => {
      return this.onLoaded(metadata);
    }, err => {
      return this.onError(err, opts);
    });
  }

}
