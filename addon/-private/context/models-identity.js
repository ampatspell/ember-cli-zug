import { A } from '@ember/array';
import Internal from '../model/internal';

export default class ModelsIdentity extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.observers = A();
    this.storage = {
      all: A(),
      ref: Object.create(null)
    };
  }

  addObserver(cb) {
    this.observers.pushObject(cb);
  }

  removeObserver(cb) {
    this.observers.removeObject(cb);
  }

  notifyObservers(name, internal) {
    this.observers.map(observer => observer[name](internal));
  }

  createModel() {
    return this.context.factoryFor('zug:identity').create({ content: this.storage.all });
  }

  storeInternalModel(internal) {
    let storage = this.storage;
    let path = internal.immutablePath;

    let includes = storage.all.includes(internal);

    if(!includes) {
      storage.all.pushObject(internal);
    }

    if(path) {
      storage.ref[path] = internal;
    }

    if(!includes) {
      this.notifyObservers('added', internal);
    }
  }

  removeInternalModel(internal) {
    let storage = this.storage;
    let path = internal.immutablePath;

    let includes = storage.all.includes(internal);

    if(includes) {
      storage.all.removeObject(internal);
    }

    if(path) {
      delete storage.ref[path];
    }

    if(includes) {
      this.notifyObservers('removed', internal);
    }
  }

  existingInternalModel(path) {
    return this.storage.ref[path];
  }

  willDestroy() {
    this.storage.all.map(internal => internal.destroy());
    super.willDestroy();
  }

}
