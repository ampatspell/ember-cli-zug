import Destroyable from '../model/destroyable';

export default class ObjectObserver extends Destroyable {

  // { onChange(key) {} }
  constructor(object, keys, delegate) {
    super();
    this.object = object;
    this.keys = keys;
    this.delegate = delegate;
  }

  _keyDidChange(sender, key) {
    this.delegate.onChange(key);
  }

  _withKeys(cb) {
    let { object, keys } = this;
    if(!keys || keys.length === 0) {
      return;
    }
    keys.map(key => cb(object, key));
  }

  start() {
    if(this.isObserving) {
      return;
    }
    this.isObserving = true;
    this._withKeys((object, key) => object.addObserver(key, this, this._keyDidChange));
  }

  stop() {
    if(!this.isObserving) {
      return;
    }
    this.isObserving = false;
    this._withKeys((object, key) => object.removeObserver(key, this, this._keyDidChange));
  }

  willDestroy() {
    this.stop();
    super.willDestroy();
  }

}
