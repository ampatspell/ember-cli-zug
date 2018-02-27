import Destroyable from '../destroyable';
import { run } from '@ember/runloop';
import { defer } from 'rsvp';

export default class SnapshotObserver extends Destroyable {

  constructor(query, delegate, options) {
    super();
    this._query = query;
    this._options = options;
    this._delegate = delegate;
    this._deferred = null;
    this._loaded = false;
    this._metadata = null;
    this._isStarted = false;
    this._content = null;
  }

  get promise() {
    this.start();
    return this._deferred && this._deferred.promise;
  }

  get metadata() {
    return this._metadata;
  }

  get content() {
    return this._content;
  }

  get loaded() {
    return this._loaded;
  }

  _onLoading() {
    let onLoading = this._delegate.onLoading;
    onLoading && onLoading();
  }

  _onLoaded() {
    let onLoaded = this._delegate.onLoaded;
    onLoaded && onLoaded();
  }

  _createModel(doc) {
    return this._delegate.createModel(doc);
  }

  _updateModel(model, doc) {
    return this._delegate.updateModel(model, doc);
  }

  _destroyModel(model) {
    return this._delegate.destroyModel(model);
  }

  _onUpdated() {
    this._delegate.onUpdated();
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
    this._cancel = this._query.onSnapshot(this._options, snapshot => run(() => this._onSnapshotInternal(snapshot)));
    this._isStarted = true;
    this._onLoading();
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

    this._cancel();
    this._deferred.resolve();

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
