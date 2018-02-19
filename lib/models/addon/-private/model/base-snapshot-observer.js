import Destroyable from './destroyable';
import { run } from '@ember/runloop';
import { defer } from 'rsvp';
import FireError from '../util/error';

export default class BaseSnapshotObserver extends Destroyable {

  constructor(query, delegate, snapshotOptions) {
    super();
    this._query = query;
    this._snapshotOptions = snapshotOptions;
    this._delegate = delegate;
    this._deferred = null;
    this._loaded = false;
    this._metadata = null;
    this._isStarted = false;
  }

  get _type() {
    return 'base-snapshot-observer';
  }

  get promise() {
    this.start();
    return this._deferred && this._deferred.promise;
  }

  get metadata() {
    return this._metadata;
  }

  get loaded() {
    return this._loaded;
  }

  _onSnapshotInternal(snapshot) {
    // console.log('_onSnapshotInternal', this);
    this._onSnapshot(snapshot);
    this._metadata = snapshot.metadata;
    this._loaded = true;
    this._deferred.resolve();
  }

  _start() {
    if(this._isStarted || this.isDestroyed) {
      return;
    }
    // console.log('_start', this);
    this._deferred = defer();
    this._cancel = this._query.onSnapshot(this._snapshotOptions, snapshot => run(() => this._onSnapshotInternal(snapshot)));
    this._isStarted = true;
  }

  start() {
    this._start();
  }

  _stop() {
  }

  _stopInternal() {
    // console.log('_stopInternal', this);

    if(!this._isStarted) {
      return;
    }

    let error = this._type;

    this._cancel();
    this._deferred.reject(new FireError({ error, reason: 'cancelled' }));

    this._stop();

    this._cancel = null;
    this._query = null;
    this._deferred = null;
  }

  willDestroy() {
    this._stopInternal();
    super.willDestroy();
  }

}
