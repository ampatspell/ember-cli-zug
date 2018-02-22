import Destroyable from './destroyable';
import { resolve, defer } from 'rsvp';
import { assert } from '@ember/debug';
import FireError from '../util/error';

class Operation extends Destroyable {

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

export default class Queue extends Destroyable {

  constructor(parent) {
    super();
    this.parent = parent;
    this.operations = [];
    this.running = null;
  }

  schedule(info, fn) {
    let operation = new Operation(fn, info);
    this.operations.push(operation);
    this.parent.register(operation);
    this.next();
    return operation.promise;
  }

  next() {
    if(this.running) {
      return;
    }
    let operations = this.operations;
    let operation = operations[0];
    if(!operation) {
      return;
    }
    this.running = operation;
    operation.invoke().catch(() => {}).finally(() => {
      assert('running operation must match operation in scope', this.running === operation);
      assert('first operation must be operation in scope', operations[0] === operation);
      operations.shift();
      this.running = null;
      this.parent.remove(operation);
      this.next();
    });
  }

  willDestroy() {
    this.operations.forEach(op => op.destroy());
    super.willDestroy();
  }

}
