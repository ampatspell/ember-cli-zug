import InternalData from './internal-data';

export default class InternalObject extends InternalData {

  constructor(context, parent) {
    super(context, parent, Object.create(null));
  }

  getModelForKey(key) {
    let internal = this.content[key];
    return this.toModel(internal);
  }

  setModelForKey(key, value) {
    // let internal = this.deserialize(key, value);
    // return this.toModel(internal);
  }

  createModel() {
    return this.factoryFor('models:object').create({ _internal: this });
  }

  deserializeValue(key, value) {
    let internal = this.toInternal(value);
    let content = this.content;
    let current = content[key];
  }

  deserialize(value) {
    for(let key in value) {
      this.deserializeValue(key, value[key]);
    }
  }

}
