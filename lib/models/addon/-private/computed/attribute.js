import Destroyable from '../model/destroyable';

export default class AttributeProperty extends Destroyable {

  constructor(owner, key, opts) {
    super();
    this.owner = owner;
    this.key = key;
    this.opts = opts;
  }

  reusable() {
    return true;
  }

  get doc() {
    let doc = this._doc;
    if(!doc) {
      doc = this.owner.get('doc');
      this._doc = doc;
    }
    return doc;
  }

  get data() {
    let data = this._data;
    if(!data) {
      data = this.doc.get('data');
      this._data = data;
      // bind observer
    }
    return data;
  }

  model() {
    let key = this.opts.key || this.key;
    return this.data.get(key);
  }

}
