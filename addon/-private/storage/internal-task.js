import Internal from '../model/internal';
import { resolve } from 'rsvp';
import { join } from '@ember/runloop';
import firebase from 'firebase';
import { keys } from './task';

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

  onSnapshot(snapshot) {
    // console.log('onSnapshot', snapshot);
    this.withPropertyChanges(true, changed => {
      this.snapshot = snapshot;
      keys.map(key => changed(key));
      changed('percent');
    });
    console.log(this.model(true).get('serialized'));
  }

  onError(err) {
    console.log('onError', err);
    this.withPropertyChanges(true, changed => {
      this.error = err;
      changed('error');
    });
    this.taskDidFinish();
  }

  onCompleted() {
    console.log('onCompleted');
    this.withPropertyChanges(true, changed => {
      this.isCompleted = true;
      changed('isCompleted');
    });
    console.log(this.model(true).get('serialized'));
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
  }

  taskDidFinish() {
    this.stopObservingTask();
    // TODO: remove from running tasks
  }

  willDestroy() {
    this.stopObservingTask();
    super.willDestroy();
  }

}
