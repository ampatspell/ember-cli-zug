import Internal from '../model/internal';
import { resolve } from 'rsvp';
import { assert } from '@ember/debug';
import Reference from './internal-reference';
import Tasks from './internal-tasks';

export default class InternalStorage extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.tasks = new Tasks(context);
    this._storage = null;
  }

  get identity() {
    return this.context.identity.storage;
  }

  createModel() {
    return this.context.factoryFor('zug:storage').create({ _internal: this });
  }

  //

  get storage() {
    let storage = this._storage;
    if(!storage) {
      let app = this.context.firebase;
      assert(`context should be ready before accessing storage`, !!app);
      storage = app.storage();
      this._storage = storage;
    }
    return storage;
  }

  withStorage(fn) {
    let storage = this.storage;
    return resolve(fn(storage));
  }

  //

  createReference(ref) {
    return new Reference(this.context, this, ref);
  }

  existingReference(ref, opts={}) {
    let identity = this.identity;
    let internal = identity.existingForRef(ref);
    if(!internal && opts.create) {
      internal = this.createReference(ref);
      identity.storeReference(internal);
    }
    return internal;
  }

  refFromOptions(opts={}) {
    if(typeof opts === 'string') {
      opts = { path: opts };
    }

    let { path, url } = opts;
    assert(`path or url is requied`, path || url);

    let storage = this.storage;
    if(path) {
      return storage.ref(path);
    }
    return storage.refFromURL(url);
  }

  ref(opts) {
    let ref = this.refFromOptions(opts);
    return this.existingReference(ref, { create: true });
  }

  registerOperation(operation) {
    this.context.operations.invoke(operation);
  }

  registerTask(task) {
    this.registerOperation(task.operation);
    this.tasks.register(task);
  }

  unregisterTask(task) {
    this.tasks.unregister(task);
  }

  referenceWillDestroy(internal) {
    this.identity.removeReference(internal);
  }

  willDestroy() {
    this.tasks.destroy();
    super.willDestroy();
  }

}
