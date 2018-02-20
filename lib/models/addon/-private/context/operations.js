import Destroyable from '../model/destroyable';
import { A } from '@ember/array';
import { defer, allSettled } from 'rsvp';
import { next } from '@ember/runloop';

export default class Operations extends Destroyable {

  constructor() {
    super();
    this.operations = A();
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
    next(() => {
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
    next(() => this._settle(deferred));
    return deferred.promise;
  }

}
