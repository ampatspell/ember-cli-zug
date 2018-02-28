import Property from '../property';
import ObjectObserver from '../../model/object-observer';

export default class AttributeProperty extends Property {

  normalizeOpts(opts) {
    opts.key = opts.key || this.key;
    console.log(opts);
    return opts;
  }

  get doc() {
    let doc = this._doc;
    if(!doc) {
      doc = this.owner.get('doc');
      this._doc = doc;
    }
    return doc;
  }

  dataObserver(create) {
    let observer = this._dataObserver;
    if(!observer && create) {
      observer = new ObjectObserver(this.data, [ this.opts.key ], { onChange: () => this.notifyPropertyChange() });
      this._dataObserver = observer;
    }
    return observer;
  }

  didLookupData() {
    this.dataObserver(true).start();
    this.startOwnerObserver();
  }

  get data() {
    let data = this._data;
    if(!data) {
      data = this.doc.get('data');
      this._data = data;
      this.didLookupData();
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

  willReset() {
    let observer = this._dataObserver;
    if(observer) {
      observer.destroy();
      this._dataObserver = null;
    }
    super.willReset();
  }

}
