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

  _onLoaded() {
  }

  _onSnapshotInternal(snapshot) {
    this._onSnapshot(snapshot);
    this._metadata = snapshot.metadata;
    if(!this._loaded) {
      this._onLoaded();
    }
    this._loaded = true;
    this._deferred.resolve(snapshot);
  }

  _start() {
    if(this._isStarted || this.isDestroyed) {
      return;
    }
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
