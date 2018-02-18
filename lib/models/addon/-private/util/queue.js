import { resolve, defer } from 'rsvp';
import { assert } from '@ember/debug';

class Operation {

  constructor(fn, info) {
    this.fn = fn;
    this.info = info;
    this.deferred = defer();
  }

  invoke() {
    console.log('→', this.info);
    resolve().then(() => this.fn()).then(arg => this.deferred.resolve(arg), err => this.deferred.reject(err));
    return this.promise;
  }

  get promise() {
    return this.deferred.promise;
  }

}

export default class Queue {

  constructor() {
    this.operations = [];
    this.running = null;
  }

  schedule(info, fn) {
    let operation = new Operation(fn, info);
    this.operations.push(operation);
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
      this.next();
    });
  }

}
