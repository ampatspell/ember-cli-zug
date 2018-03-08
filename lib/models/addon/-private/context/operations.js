import Destroyable from '../model/destroyable';
import { A } from '@ember/array';
import { defer, allSettled } from 'rsvp';
import { schedule } from '@ember/runloop';

const afterRender = fn => schedule('afterRender', fn);

export default class Operations extends Destroyable {

  constructor() {
    super();
    this.operations = A();
  }

  invoke(operation) {
    this.register(operation);
    operation.promise.catch(() => {}).finally(() => this.remove(operation));
    operation.invoke();
    return operation.promise;
  }

  register(op) {
    this.operations.pushObject(op);
  }

  remove(op) {
    this.operations.removeObject(op);
  }

  _settleIteration() {
    let operations = this.operations;
    if(operations.length === 0) {
      return;
    }
    return allSettled(operations.map(op => op.promise));
  }

  _settle(deferred) {
    afterRender(() => {
      let iteration = this._settleIteration();
      if(!iteration) {
        deferred.resolve();
        return;
      }
      iteration.then(() => this._settle(deferred));
    });
  }

  settle() {
    let deferred = defer();
    afterRender(() => this._settle(deferred));
    return deferred.promise;
  }

}
