import Internal from '../model/internal';
import { A } from '@ember/array';
import DataManager from './data-manager';

export default class InternalContext extends Internal {

  constructor(stores, identifier) {
    super();

    this.stores = stores;
    this.identifier = identifier;

    this.firebase = null;
    this.firestore = null;
    this.ready = null;

    this.contexts = A();

    this.dataManager = new DataManager(this);
  }

  factoryFor(name) {
    return this.stores.factoryFor(name);
  }

  createModel() {
    return this.factoryFor('models:context').create({ _internal: this });
  }

  fork(identifier) {
    let internal = this.stores.createInternalNestedContext(this, identifier);
    this.contexts.pushObject(internal);
    return internal;
  }

  nestedContextWillDestroy(internal) {
    this.contexts.removeObject(internal);
  }

  willDestroy() {
    this.contexts.map(context => context.destroy());
    super.willDestroy();
  }

}
