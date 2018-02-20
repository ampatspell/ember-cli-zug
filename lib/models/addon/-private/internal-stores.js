import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import Internal from './model/internal';
import InternalRootContext from './context/internal-root-context';
import InternalNestedContext from './context/internal-nested-context';

export default class InternalStores extends Internal {

  constructor(model) {
    super();
    this._model = model;
    this.contexts = A();
  }

  factoryFor(name) {
    return getOwner(this.model(true)).factoryFor(name);
  }

  createInternalRootContext(identifier, opts) {
    let internal = new InternalRootContext(this, identifier, opts);
    this.contexts.pushObject(internal);
    return internal;
  }

  createInternalNestedContext(parent, identifier) {
    return new InternalNestedContext(parent, identifier);
  }

  rootContextWillDestroy(internal) {
    this.contexts.removeObject(internal);
  }

  willDestroy() {
    this.contexts.map(context => context.destroy());
    super.willDestroy();
  }

}
