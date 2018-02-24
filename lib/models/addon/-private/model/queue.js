import Destroyable from './destroyable';
import { assert } from '@ember/debug';
import Operation from './operation';

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
