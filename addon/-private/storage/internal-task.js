import Internal from '../model/internal';
import { resolve } from 'rsvp';
import { join } from '@ember/runloop';
import firebase from 'firebase';
import { keys } from './task';
import { PromiseOperation } from '../model/operation';

const {
  STATE_CHANGED
} = firebase.storage.TaskEvent;

export default class InternalTask extends Internal {

  constructor(context, reference, type, task) {
    super();
    this.context = context;
    this.reference = reference;
    this.type = type;
    this.task = task;
    this._taskObserver = null;
    this.promise = resolve(task);
    this.operation = new PromiseOperation(this.promise, { name: 'storage/task' });
    this.snapshot = task.snapshot;
    this.isCompleted = false;
    this.error = null;
    this.startObservingTask();
  }

  createModel() {
    return this.context.factoryFor('zug:storage/task').create({ _internal: this });
  }

  get percent() {
    let { bytesTransferred, totalBytes } = this.snapshot;
    return Math.floor(bytesTransferred / totalBytes * 100);
  }

  get isRunning() {
    return !this.isCompleted;
  }

  get isError() {
    return !!this.error;
  }

  _onCompleted(changed) {
    this.isCompleted = true;
    changed('isCompleted');
    changed('isRunning');
  }

  _onError(changed, error) {
    this.error = error;
    changed('error');
    changed('isError');
    this._onCompleted(changed);
  }

  _onSnapshot(changed, snapshot) {
    this.snapshot = snapshot;
    keys.map(key => changed(key));
    changed('percent');
  }

  onSnapshot(snapshot) {
    this.withPropertyChanges(true, changed => this._onSnapshot(changed, snapshot));
  }

  onError(err) {
    this.withPropertyChanges(true, changed => this._onError(changed, err));
    this.taskDidFinish();
  }

  onCompleted() {
    this.withPropertyChanges(true, changed => this._onCompleted(changed));
    this.taskDidFinish();
  }

  startObservingTask() {
    this._taskObserver = this.task.on(STATE_CHANGED,
      snapshot => join(() => this.onSnapshot(snapshot)),
      err => join(() => this.onError(err)),
      () => join(() => this.onCompleted())
    );
  }

  stopObservingTask() {
    let cancel = this._taskObserver;
    if(cancel) {
      cancel();
    }
    this._taskObserver = null;
    this.reference.unregisterTask(this);
  }

  taskDidFinish() {
    this.stopObservingTask();
  }

  willDestroy() {
    this.stopObservingTask();
    super.willDestroy();
  }

}
