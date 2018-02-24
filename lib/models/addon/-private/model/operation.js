import Destroyable from './destroyable';
import { resolve, defer } from 'rsvp';
import FireError from '../util/error';

export default class Operation extends Destroyable {

  constructor(fn, info) {
    super();
    this.fn = fn;
    this.info = info;
    this.deferred = defer();
  }

  invoke() {
    if(this.isDestroyed) {
      this.deferred.reject(new FireError({ error: 'operation', reason: 'cancelled' }));
    }
    resolve().then(() => this.fn()).then(arg => this.deferred.resolve(arg), err => this.deferred.reject(err));
    return this.promise;
  }

  get promise() {
    return this.deferred.promise;
  }

}
