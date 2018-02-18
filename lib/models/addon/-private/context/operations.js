import EmberObject from '@ember/object';
import { array } from '../util/computed';
import { defer, allSettled } from 'rsvp';
import { next } from '@ember/runloop';

export default EmberObject.extend({

  context: null,
  operations: array(),

  register(op) {
    this.get('operations').pushObject(op);
  },

  remove(op) {
    this.get('operations').removeObject(op);
  },

  _settleIteration() {
    let operations = this.get('operations');
    if(operations.get('length') === 0) {
      return;
    }
    return allSettled(operations.map(op => op.promise));
  },

  _settle(deferred) {
    next(() => {
      let iteration = this._settleIteration();
      if(!iteration) {
        deferred.resolve();
        return;
      }
      iteration.then(() => this._settle(deferred));
    });
  },

  settle() {
    let deferred = defer();
    next(() => this._settle(deferred));
    return deferred.promise;
  }

});
