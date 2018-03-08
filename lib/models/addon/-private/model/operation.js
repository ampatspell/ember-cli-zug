import Destroyable from './destroyable';
import { resolve, defer } from 'rsvp';
import FireError from '../util/error';

export class DeferredOperation extends Destroyable {

  constructor(deferred, info) {
    super();
    this.info = info;
    this.deferred = deferred;
  }

  invoke() {
    return this.promise;
  }

  get promise() {
    return this.deferred.promise;
  }

}

export default class Operation extends DeferredOperation {

  constructor(fn, info) {
    super(defer(), info);
    this.fn = fn;
  }

  invoke() {
    if(this.isDestroyed) {
      this.deferred.reject(new FireError({ error: 'operation', reason: 'cancelled' }));
    }
    resolve().then(() => this.fn()).then(arg => this.deferred.resolve(arg), err => this.deferred.reject(err));
    return this.promise;
  }

}
