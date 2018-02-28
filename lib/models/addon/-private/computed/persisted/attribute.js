import Destroyable from '../../model/destroyable';
import ObjectObserver from '../../model/object-observer';

const normalize = (opts={}, key) => {
  opts.key = opts.key || key;
  return opts;
};

export default class AttributeProperty extends Destroyable {

  constructor(owner, key, opts) {
    super();
    this.owner = owner;
    this.key = key;
    this.opts = normalize(opts, key);
  }

  reusable() {
    return true;
  }

  notifyPropertyChange() {
    this.owner.notifyPropertyChange(this.key);
  }

  get doc() {
    let doc = this._doc;
    if(!doc) {
      doc = this.owner.get('doc');
      this._doc = doc;
    }
    return doc;
  }

  didLookupData(data) {
    let observer = new ObjectObserver(data, [ this.opts.key ], { onChange: () => this.notifyPropertyChange() });
    this._observer = observer;
    observer.start();
  }

  get data() {
    let data = this._data;
    if(!data) {
      data = this.doc.get('data');
      this._data = data;
      this.didLookupData(data);
    }
    return data;
  }

  // transforms
  getValue() {
    return this.data.get(this.opts.key);
  }

  setValue(value) {
    return this.data.set(this.opts.key, value);
  }

  willDestroy() {
    this._observer && this._observer.destroy();
    super.willDestroy();
  }

}
