import Destroyable from '../destroyable';
import { run } from '@ember/runloop';
import { defer } from 'rsvp';
import Operation from '../operation';

export default class SnapshotObserver extends Destroyable {

  constructor(context, query, delegate, options) {
    super();
    this._context = context;
    this._query = query;
    this._options = options;
    this._delegate = delegate;
    this._deferred = null;
    this._loaded = false;
    this._metadata = null;
    this._isStarted = false;
    this._content = null;
    this._operation = null;
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

  _registerOperation(operation) {
    let operations = this._context.operations;
    operations.register(operation);
    operation.promise.catch(() => {}).finally(() => operations.remove(operation));
    operation.invoke();
  }

  _start() {
    if(this._isStarted || this.isDestroyed) {
      return;
    }
    this._deferred = defer();
    this._operation = new Operation(() => this._deferred.promise, { name: 'query' });
    this._cancel = this._query.onSnapshot(this._options, snapshot => run(() => this._onSnapshotInternal(snapshot)));
    this._isStarted = true;
    this._registerOperation(this._operation);
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
    this._operation = null;
  }

  willDestroy() {
    this._stopInternal();
    super.willDestroy();
  }

}
