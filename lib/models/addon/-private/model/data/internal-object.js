import InternalData from './internal-data';

export default class InternalObject extends InternalData {

  constructor(context) {
    super(context, Object.create(null));
  }

  getModelForKey(key) {
    let internal = this.content[key];
    return this.internalToModel(internal);
  }

  setModelForKey(key, value) {
    let internal = this.deserializeKey(key, value);
    return this.internalToModel(internal);
  }

  createModel() {
    return this.factoryFor('models:object').create({ _internal: this });
  }

  deserializeKey(key, value) {
    let content = this.content;
    let current = content[key];
    let { internal, updated } = this.update(current, value);
    if(updated) {
      content[key] = internal;
    }
    return internal;
  }

  deserialize(value) {
    for(let key in value) {
      this.deserializeKey(key, value[key]);
    }
  }

}
