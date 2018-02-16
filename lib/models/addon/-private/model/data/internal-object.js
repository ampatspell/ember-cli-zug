import InternalData from './internal-data';
import {
  toModel
} from './util';

const rm = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class InternalObject extends InternalData {

  constructor(context, parent) {
    super(context, parent, Object.create(null));
  }

  createModel() {
    return this.factoryFor('models:object').create({ _internal: this });
  }

  //

  getModelForKey(key) {
    let internal = this.content[key];
    return toModel(internal);
  }

  setModelForKey(key, value) {
    let internal = this._setValue(key, value);
    return toModel(internal);
  }

  //

  _setValue(key, value) {
    let content = this.content;
    let current = content[key];

    let { update, internal } = this._deserializeValue(value, current);

    if(update) {
      if(internal === undefined) {
        delete content[key];
      } else {
        content[key] = internal;
      }
    }

    return internal;
  }

  deserialize(values) {
    let setter = (key, value) => this._setValue(key, value);
    let keys = Object.keys(this.content);
    for(let key in values) {
      rm(keys, key);
      setter(key, values[key]);
    }
    keys.forEach(key => setter(key, undefined));
  }

  serialize() {
    let json = {};
    let content = this.content;
    for(let key in content) {
      let value = this._serializeValue(content[key]);
      if(value !== undefined) {
        json[key] = value;
      }
    }
    return json;
  }

}